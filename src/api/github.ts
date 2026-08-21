import { GitHubRepository } from "@/types/github/githubRepository";
import { apiInstance } from "./axios"

const prefix = "/github"
const prefix_auth = "/auth/github"

export const loginGithub = () => {
  window.location.href =
    `${process.env.NEXT_PUBLIC_API_URL}${prefix_auth}`;
};

export const getGitHubRepositories = async (): Promise<
  GitHubRepository[]
> => {
  const response =
    await apiInstance.get(
      `${prefix}/repositories`,
    );

  return response.data.data;
};

export const connectGitHub = async () => {
  const response = await apiInstance.get(
    `${prefix}/install`,
  );

  window.location.href = response.data.url;
};