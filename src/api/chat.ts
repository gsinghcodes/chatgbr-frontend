import { apiInstance } from "./axios";

export interface ChatRequest {
  question: string;
}

export async function chat(
  repositoryId: string,
  data: ChatRequest,
) {
  const response = await apiInstance.post(
    `/repositories/${repositoryId}/chat`,
    data,
  );

  return response.data;
}