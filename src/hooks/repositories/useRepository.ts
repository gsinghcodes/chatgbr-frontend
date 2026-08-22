import { useQuery } from "@tanstack/react-query";

import { getRepository } from "@/api/repositories";

export function useRepository(repositoryId?: string) {
  return useQuery({
    queryKey: ["repositories", repositoryId],
    queryFn: () => getRepository(repositoryId as string),
    enabled: Boolean(repositoryId),
    refetchInterval: (query) => {
      const response = query.state.data;

      if (!response) {
        return 1000;
      }

      const repository = response.data?.repository;

      if (!repository) {
        return false;
      }

      if (
        repository.status === "READY" ||
        repository.status === "FAILED"
      ) {
        return false;
      }

      return 1000;
    },
  });
}