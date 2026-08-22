import axios from "axios";
import { getNewToken } from "./auth";

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


apiInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

export const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const token = await getNewToken();
        localStorage.setItem("access_token", token);
        return token;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401
      && !originalRequest._retry
      && originalRequest.url !== `/api/v1/auth/refresh`
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiInstance(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("access_token");

        if (typeof window !== "undefined") {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
)