import { useQuery } from "@tanstack/react-query";

import { getConversations } from "@/api/conversations";

export function useConversations(repositoryId?: string) {
  return useQuery({
    queryKey: ["conversations", repositoryId],
    queryFn: () => getConversations(repositoryId as string),
    enabled: !!repositoryId,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;

      if (status && status >= 400 && status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
}