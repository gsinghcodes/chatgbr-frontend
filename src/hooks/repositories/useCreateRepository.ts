import axios from "axios";
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

    onError: (error) => {
      console.log("full error:", error);
      if (axios.isAxiosError(error)) {
        console.log("response.data:", error.response?.data);
      }
    },
  });
}