import { apiInstance } from "./axios";


export const getRepositories = async () => {
  const response = await apiInstance.get("/repositories");

  return response.data;
}

export async function getRepository(
  repositoryId: string,
){
  const response = await apiInstance.get(
    `/repositories/${repositoryId}`,
  );

  return response.data;
}

export const createRepository = async (data: {
  clone_url: string;
}) => {
  const response = await apiInstance.post(
    "/repositories",
    data,
  );
  return response.data;
}

export const deleteRepository = async (repositoryId: string) => {
  const response = await apiInstance.delete(`/repositories/${repositoryId}`);
  return response.data;
};
