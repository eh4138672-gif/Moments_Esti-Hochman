import { axiosClient } from "./axiosClient";
import type { GalleryItem } from "../types/gallery";
import type { Category } from "../types/project";

// GET /gallery?category=Family&limit=5 → תמונות הגלריה (פתוח לכולם)
// בלי category = כל התמונות. limit = כמה להחזיר (למשל 5 לדף הבית).
export async function getGallery(category?: Category, limit?: number): Promise<GalleryItem[]> {
  // axios מדלג לבד על פרמטרים שהם undefined – אז לא נשלח "category=" ריק
  const response = await axiosClient.get<GalleryItem[]>("/gallery", { params: { category, limit } });
  return response.data;
}

// POST /gallery (מנהלת) – העלאת תמונה אחת עם כותרת וקטגוריה
export async function uploadGalleryItem(file: File, title: string, category: Category): Promise<GalleryItem> {
  // קבצים נשלחים ב־FormData (multipart). לא מגדירים Content-Type – הדפדפן עושה את זה לבד.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("category", category);
  const response = await axiosClient.post<GalleryItem>("/gallery", formData);
  return response.data;
}

// DELETE /gallery/{id} (מנהלת) → 204, בלי תוכן
export async function deleteGalleryItem(id: number): Promise<void> {
  await axiosClient.delete(`/gallery/${id}`);
}
