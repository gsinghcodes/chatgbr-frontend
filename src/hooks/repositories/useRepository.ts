import { useQuery } from "@tanstack/react-query";

import {
  getRepository,
} from "@/api/repositories";

export function useRepository(repositoryId?: string) {
  return useQuery({
    queryKey: ["repositories", repositoryId],
    queryFn: () => getRepository(repositoryId as string),
    enabled: Boolean(repositoryId),
  });
}
