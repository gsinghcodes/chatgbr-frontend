import { deleteRepository } from "@/api/repositories";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteRepository = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repositoryId: string) => deleteRepository(repositoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["repositories"],
            });
        },
    });
};;