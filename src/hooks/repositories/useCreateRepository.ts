import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRepository } from "@/api/repositories";

export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
  });
}
