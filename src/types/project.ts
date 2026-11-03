import type { PackageTier } from "./package";

// ערכי הבחירה – בדיוק כמו בשרת (באנגלית). התרגום לעברית נמצא ב־utils/statusLabels.ts
export type Category = "Babies" | "FirstBirthday" | "Upsherin" | "Family" | "Albums";
export type WorkStatus = "Photographed" | "Editing" | "Completed" | "Delivered";
export type AlbumStatus = "None" | "SelectingPhotos" | "Designing" | "Ready";

// פרויקט צילום – כפי שמגיע ברשימות
export interface Project {
  id: number;
  clientName: string;
  clientEmail: string;
  userId: number | null; // null = הלקוח עוד לא נרשם
  category: Category;
  packageId: number;
  packageName: string;
  packageTier: PackageTier;
  includesAlbum: boolean;
  workStatus: WorkStatus;
  albumStatus: AlbumStatus;
  shootDate: string; // "YYYY-MM-DD"
  cost: number;
  coverImageUrl: string | null; // null = אין עדיין תמונות
  downloadLink: string | null; // קישור לתמונות המלאות (למשל ג׳מבו). null = אין
  notes?: string | null; // מגיע רק למנהלת – אצל לקוח השדה לא קיים
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPhoto {
  id: number;
  url: string;
  createdAt: string;
}

// פרויקט אחד (GET /projects/{id}) – כמו Project ועוד רשימת התמונות
export interface ProjectDetails extends Project {
  photos: ProjectPhoto[];
}

// מה ששולחים ביצירה (POST) ובעריכה (PUT)
export interface ProjectInput {
  clientName: string;
  clientEmail: string;
  category: Category;
  packageId: number;
  shootDate: string; // "YYYY-MM-DD"
  workStatus?: WorkStatus; // ברירת מחדל בשרת: Photographed
  albumStatus?: AlbumStatus; // ברירת מחדל בשרת: None
  cost?: number | null; // אם לא נשלח – מחיר החבילה
  notes?: string | null;
  downloadLink?: string | null; // ריק / null = בלי קישור
}

// עדכון סטטוס מהיר (PATCH) – לפחות אחד מהשניים
export interface ProjectStatusInput {
  workStatus?: WorkStatus;
  albumStatus?: AlbumStatus;
}

// סינונים ומיון של GET /projects – הכול אופציונלי
export type ProjectSortBy = "shootDate" | "cost" | "clientName" | "createdAt";

export interface ProjectFilters {
  search?: string;
  category?: Category;
  packageId?: number;
  workStatus?: WorkStatus;
  albumStatus?: AlbumStatus;
  sortBy?: ProjectSortBy;
  sortDir?: "asc" | "desc";
}
