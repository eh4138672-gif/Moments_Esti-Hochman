import type { AlbumStatus, Category, WorkStatus } from "../types/project";
import type { PackageTier } from "../types/package";

// תרגום הערכים שמגיעים מהשרת (אנגלית) לתוויות בעברית.
// Record<X, string> מחייב תרגום לכל ערך – אם שוכחים אחד, TypeScript מתריע.

export const categoryLabels: Record<Category, string> = {
  Babies: "תינוקות",
  Kids: "ילדים",
  Family: "משפחה",
  Nature: "טבע",
  Styling: "סטיילינג",
};

export const workStatusLabels: Record<WorkStatus, string> = {
  Photographed: "צולם",
  Editing: "בשלבי עריכה",
  Completed: "הסתיימה העבודה",
  Delivered: "נמסר",
};

export const albumStatusLabels: Record<AlbumStatus, string> = {
  None: "ללא אלבום",
  SelectingPhotos: "בבחירת תמונות",
  Designing: "בעיצוב",
  Ready: "מוכן",
};

export const packageTierLabels: Record<PackageTier, string> = {
  Basic: "בסיס",
  Premium: "פרימיום",
};

// סדר השלבים – בשביל ה־StatusStepper ובשביל רשימות בחירה (Pill / select)
export const CATEGORIES: Category[] = ["Babies", "Kids", "Family", "Nature", "Styling"];
export const WORK_STATUS_STEPS: WorkStatus[] = ["Photographed", "Editing", "Completed", "Delivered"];
export const ALBUM_STATUS_STEPS: AlbumStatus[] = ["None", "SelectingPhotos", "Designing", "Ready"];
