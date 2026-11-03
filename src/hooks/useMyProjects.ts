import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "../api/projectsApi";

// הפרויקטים של הלקוח המחובר – GET /projects/my
// השרת מסנן לפי הטוקן, כך שכל לקוח מקבל רק את שלו
export function useMyProjects() {
  return useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
  });
}
