import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../api/packagesApi";

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: Infinity,
  });
}
