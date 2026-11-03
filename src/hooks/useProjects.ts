import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectsApi";
import type { ProjectFilters } from "../types/project";

// כל הפרויקטים (מנהלת) – GET /projects עם חיפוש / סינון / מיון
// הסינונים הם חלק מהמפתח: כל שילוב סינונים נשמר בזיכרון בנפרד,
// ושינוי בסינון = מפתח חדש = React Query מביא את הרשימה מחדש לבד
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
    placeholderData: (previous) => previous, // בזמן החלפת סינון – הטבלה הקודמת נשארת במקום "טוען..." מהבהב
  });
}
