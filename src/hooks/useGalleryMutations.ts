import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGalleryItem, uploadGalleryItem } from "../api/galleryApi";
import type { Category } from "../types/project";

function useRefreshGallery() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["gallery"] });
}

export function useUploadGalleryItem() {
  const refresh = useRefreshGallery();
  return useMutation({
    mutationFn: ({ file, title, category }: { file: File; title: string; category: Category }) =>
      uploadGalleryItem(file, title, category),
    onSuccess: refresh,
  });
}

export function useDeleteGalleryItem() {
  const refresh = useRefreshGallery();
  return useMutation({
    mutationFn: (id: number) => deleteGalleryItem(id),
    onSuccess: refresh,
  });
}
