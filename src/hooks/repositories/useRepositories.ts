import { useQuery } from "@tanstack/react-query";

import {
  getRepositories,
} from "@/api/repositories";

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: getRepositories,
  });
}