import { useQuery } from "@tanstack/react-query";
import { getGallery } from "../api/galleryApi";
import type { Category } from "../types/project";

export function useGallery(category?: Category, limit?: number) {
  return useQuery({
    queryKey: ["gallery", category, limit],
    queryFn: () => getGallery(category, limit),
  });
}
