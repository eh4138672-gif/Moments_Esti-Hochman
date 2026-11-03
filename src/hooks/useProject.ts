import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/projectsApi";

// פרויקט אחד כולל התמונות שלו – GET /projects/{id}
export function useProject(id: number) {
  return useQuery({
    queryKey: ["project", id], // לכל פרויקט מקום משלו בזיכרון
    queryFn: () => getProject(id),
    enabled: Number.isInteger(id) && id > 0, // id לא תקין (למשל /my-projects/abc) → לא שולחים בכלל
    retry: false, // 403 / 404 לא ישתנו אם ננסה שוב – מציגים הודעה מיד
  });
}
