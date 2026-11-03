import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGalleryItem, uploadGalleryItem } from "../api/galleryApi";
import type { Category } from "../types/project";

// ["gallery"] תופס את כל המפתחות של הגלריה – כל הקטגוריות, וגם 5 העבודות של דף הבית
function useRefreshGallery() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["gallery"] });
}

// העלאת תמונה לגלריה הציבורית – POST /gallery (multipart: file, title, category)
export function useUploadGalleryItem() {
  const refresh = useRefreshGallery();
  return useMutation({
    mutationFn: ({ file, title, category }: { file: File; title: string; category: Category }) =>
      uploadGalleryItem(file, title, category),
    onSuccess: refresh,
  });
}

// מחיקת תמונה מהגלריה – DELETE /gallery/{id}
export function useDeleteGalleryItem() {
  const refresh = useRefreshGallery();
  return useMutation({
    mutationFn: (id: number) => deleteGalleryItem(id),
    onSuccess: refresh,
  });
}
