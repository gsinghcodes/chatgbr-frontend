import { apiInstance } from "./axios";

export interface Repository {
  id: string;
  name: string;
  clone_url: string;
  size_in_bytes: number;
  status: string;
  last_indexed_at: string | null;
}

function unwrapData<T>(value: T | { data: T }): T {
  if (
    value &&
    typeof value === "object" &&
    "data" in value
  ) {
    return value.data;
  }

  return value;
}

export async function getRepositories(): Promise<Repository[]> {
  const response = await apiInstance.get("/repositories");

  return unwrapData<Repository[]>(response.data);
}

export async function getRepository(
  repositoryId: string,
): Promise<Repository> {
  const response = await apiInstance.get(
    `/repositories/${repositoryId}`,
  );

  return unwrapData<Repository>(response.data);
}

export async function createRepository(data: {
  clone_url: string;
}){
  const response = await apiInstance.post(
    "/repositories",
    data,
  );
  console.log(response)
  return response.data;
}
