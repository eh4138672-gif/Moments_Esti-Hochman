import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectsApi";
import type { ProjectFilters } from "../types/project";

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
    placeholderData: (previous) => previous,
  });
}
