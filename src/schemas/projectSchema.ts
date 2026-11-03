import { z } from "zod";

// אותם כללים כמו בשרת (FRONTEND-API-GUIDE, סעיף 8)
export const projectSchema = z.object({
  clientName: z.string().trim().min(2, "לפחות 2 תווים").max(60, "עד 60 תווים"),
  clientEmail: z.string().trim().min(1, "שדה חובה").email("כתובת אימייל לא תקינה"),
  category: z.enum(["Babies", "Kids", "Family", "Nature", "Styling"], { errorMap: () => ({ message: "יש לבחור קטגוריה" }) }),
  packageId: z.number({ errorMap: () => ({ message: "יש לבחור חבילה" }) }).int().positive("יש לבחור חבילה"),
  workStatus: z.enum(["Photographed", "Editing", "Completed", "Delivered"]),
  albumStatus: z.enum(["None", "SelectingPhotos", "Designing", "Ready"]),
  shootDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "יש לבחור תאריך"),
  // valueAsNumber: שדה ריק הופך ל־NaN – ו־zod מחזיר "שדה חובה"
  cost: z.number({ invalid_type_error: "שדה חובה" }).min(0, "העלות לא יכולה להיות שלילית").max(1_000_000, "העלות גבוהה מדי"),
  notes: z.string().max(500, "עד 500 תווים"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
