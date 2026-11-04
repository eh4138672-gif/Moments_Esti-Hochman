import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/projectsApi";

export function useProject(id: number) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  });
}
