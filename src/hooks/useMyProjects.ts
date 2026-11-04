import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "../api/projectsApi";

export function useMyProjects() {
  return useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });
}
