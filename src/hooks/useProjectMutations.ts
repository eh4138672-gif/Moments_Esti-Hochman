import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  deleteProjectPhoto,
  updateProject,
  updateProjectStatus,
  uploadProjectPhotos,
} from "../api/projectsApi";
import type { ProjectInput, ProjectStatusInput } from "../types/project";

// אחרי כל שינוי – מסמנים את כל הרשימות כ"ישנות", ו־React Query מביא אותן מחדש.
// ["projects"] תופס את כל המפתחות שמתחילים ב־"projects" – כלומר כל שילובי הסינונים
function refreshProjects(queryClient: QueryClient, id: number) {
  queryClient.invalidateQueries({ queryKey: ["projects"] });
  queryClient.invalidateQueries({ queryKey: ["project", id] });
  queryClient.invalidateQueries({ queryKey: ["my-projects"] });
}

// יצירת פרויקט – POST /projects
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => createProject(data),
    onSuccess: (project) => refreshProjects(queryClient, project.id),
  });
}

// עריכה מלאה – PUT /projects/{id}
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectInput }) => updateProject(id, data),
    onSuccess: (_project, { id }) => refreshProjects(queryClient, id),
  });
}

// עדכון סטטוס מהיר מהטבלה – PATCH /projects/{id}/status
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectStatusInput }) => updateProjectStatus(id, data),
    onSuccess: (_project, { id }) => refreshProjects(queryClient, id),
  });
}

// מחיקת פרויקט – DELETE /projects/{id}
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: (_result, id) => refreshProjects(queryClient, id),
  });
}

// העלאת תמונות לפרויקט – POST /projects/{id}/photos (עד 10 בבת אחת)
export function useUploadProjectPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: number; files: File[] }) => uploadProjectPhotos(id, files),
    // התמונה הראשונה הופכת לתמונת הכרטיס – לכן מרעננים גם את הרשימות
    onSuccess: (_photos, { id }) => refreshProjects(queryClient, id),
  });
}

// מחיקת תמונה מפרויקט – DELETE /projects/{id}/photos/{photoId}
export function useDeleteProjectPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, photoId }: { id: number; photoId: number }) => deleteProjectPhoto(id, photoId),
    onSuccess: (_result, { id }) => refreshProjects(queryClient, id),
  });
}
