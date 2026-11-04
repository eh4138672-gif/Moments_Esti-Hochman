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

function refreshProjects(queryClient: QueryClient, id: number) {
  queryClient.invalidateQueries({ queryKey: ["projects"] });
  queryClient.invalidateQueries({ queryKey: ["project", id] });
  queryClient.invalidateQueries({ queryKey: ["my-projects"] });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => createProject(data),
    onSuccess: (project) => refreshProjects(queryClient, project.id),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectInput }) => updateProject(id, data),
    onSuccess: (_project, { id }) => refreshProjects(queryClient, id),
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectStatusInput }) => updateProjectStatus(id, data),
    onSuccess: (_project, { id }) => refreshProjects(queryClient, id),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: (_result, id) => refreshProjects(queryClient, id),
  });
}

export function useUploadProjectPhotos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }: { id: number; files: File[] }) => uploadProjectPhotos(id, files),
    onSuccess: (_photos, { id }) => refreshProjects(queryClient, id),
  });
}

export function useDeleteProjectPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, photoId }: { id: number; photoId: number }) => deleteProjectPhoto(id, photoId),
    onSuccess: (_result, { id }) => refreshProjects(queryClient, id),
  });
}
