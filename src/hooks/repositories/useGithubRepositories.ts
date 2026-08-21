import { useQuery } from "@tanstack/react-query";

import {
  getGitHubRepositories,
} from "@/api/github";

export function useGitHubRepositories(enabled = true) {
  return useQuery({
    queryKey: ["github-repositories"],
    queryFn: getGitHubRepositories,
    enabled,
    staleTime: 60_000,
  });
}
