import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../api/packagesApi";

// שתי החבילות – GET /packages (לסינון בטבלה, לטופס ולדף החבילות)
export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: Infinity, // החבילות קבועות במסד – אין צורך להביא אותן שוב
  });
}
