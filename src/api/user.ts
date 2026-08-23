import { apiInstance } from "./axios";

export interface User {
  id: string;
  email: string;
  github_username?: string | null;
  avatar_url?: string | null;
  github_installed: boolean;
}

export interface UpdateUserRequest {
  avatar_url: string | null;
}

export async function updateCurrentUser(
  data: UpdateUserRequest,
): Promise<User> {
  const response = await apiInstance.patch("/auth/me", data);

  return response.data.data;
}

export async function syncGitHubProfile(): Promise<User> {
  const response = await apiInstance.post("/auth/github/sync");

  return response.data.data;
}
