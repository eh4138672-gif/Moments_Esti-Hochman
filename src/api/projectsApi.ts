import { axiosClient } from "./axiosClient";
import type {
  Project,
  ProjectDetails,
  ProjectFilters,
  ProjectInput,
  ProjectPhoto,
  ProjectStatusInput,
} from "../types/project";

// GET /projects (מנהלת) – כל הפרויקטים עם חיפוש / סינון / מיון
// דוגמה: getProjects({ search: "לוי", workStatus: "Editing", sortBy: "cost", sortDir: "asc" })
export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  // מחרוזת חיפוש ריקה לא נשלחת בכלל
  const params = { ...filters, search: filters.search?.trim() || undefined };
  const response = await axiosClient.get<Project[]>("/projects", { params });
  return response.data;
}

// GET /projects/my (לקוח) – רק הפרויקטים של המשתמש המחובר
export async function getMyProjects(): Promise<Project[]> {
  const response = await axiosClient.get<Project[]>("/projects/my");
  return response.data;
}

// GET /projects/{id} – פרויקט אחד כולל תמונות (מנהלת, או לקוח שהפרויקט שלו)
export async function getProject(id: number): Promise<ProjectDetails> {
  const response = await axiosClient.get<ProjectDetails>(`/projects/${id}`);
  return response.data;
}

// POST /projects (מנהלת) → הפרויקט החדש (201)
export async function createProject(data: ProjectInput): Promise<Project> {
  const response = await axiosClient.post<Project>("/projects", data);
  return response.data;
}

// PUT /projects/{id} (מנהלת) – עריכה מלאה: שולחים את כל השדות
export async function updateProject(id: number, data: ProjectInput): Promise<Project> {
  const response = await axiosClient.put<Project>(`/projects/${id}`, data);
  return response.data;
}

// PATCH /projects/{id}/status (מנהלת) – עדכון מהיר מהטבלה
export async function updateProjectStatus(id: number, data: ProjectStatusInput): Promise<Project> {
  const response = await axiosClient.patch<Project>(`/projects/${id}/status`, data);
  return response.data;
}

// DELETE /projects/{id} (מנהלת) → 204
export async function deleteProject(id: number): Promise<void> {
  await axiosClient.delete(`/projects/${id}`);
}

// POST /projects/{id}/photos (מנהלת) – עד 10 תמונות בבת אחת
export async function uploadProjectPhotos(id: number, files: File[]): Promise<ProjectPhoto[]> {
  const formData = new FormData();
  // כל הקבצים באותו שם שדה: "files"
  files.forEach((file) => formData.append("files", file));
  const response = await axiosClient.post<ProjectPhoto[]>(`/projects/${id}/photos`, formData);
  return response.data;
}

// DELETE /projects/{id}/photos/{photoId} (מנהלת) → 204
export async function deleteProjectPhoto(id: number, photoId: number): Promise<void> {
  await axiosClient.delete(`/projects/${id}/photos/${photoId}`);
}
