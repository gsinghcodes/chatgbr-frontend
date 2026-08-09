import { apiInstance } from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}


export async function login(data: LoginRequest) {
  const response = await apiInstance.post("/auth/login", data);

  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await apiInstance.post("/auth/register", data);

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiInstance.get("/auth/me");

  return response.data.data;
}