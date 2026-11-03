import type { Category } from "./project";

// תמונה בגלריה הציבורית – GET /gallery
export interface GalleryItem {
  id: number;
  title: string;
  category: Category;
  url: string;
  createdAt: string;
}
