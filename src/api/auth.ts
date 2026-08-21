import { apiInstance } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const BASE_URL = "/api/v1/auth"


export async function login(data: LoginRequest) {
  const response = await apiInstance.post(`${BASE_URL}/login`, data);

  return response.data;
}

export async function register(data: LoginRequest) {
  const response = await apiInstance.post(`${BASE_URL}/register`, data);

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiInstance.post(`${BASE_URL}/logout`);

  return response.data.data;
};

export const getNewToken = async () => {
  const response = await apiInstance.post(`${BASE_URL}/refresh`);

  return response.data.data.access_token;
};

export async function getCurrentUser() {
  const response = await apiInstance.get(`${BASE_URL}/me`);

  return response.data.data;
}