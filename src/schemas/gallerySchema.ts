import { z } from "zod";
import { validateImage } from "../utils/validateImage";

// טופס העלאה לגלריה – אותם כללים כמו בשרת: כותרת 2–80 תווים, קטגוריה חובה, קובץ חובה (jpg/png/webp עד 10MB)
export const gallerySchema = z.object({
  title: z.string().trim().min(2, "לפחות 2 תווים").max(80, "עד 80 תווים"),
  category: z.enum(["Babies", "FirstBirthday", "Upsherin", "Family", "Albums"], { errorMap: () => ({ message: "יש לבחור קטגוריה" }) }),
  file: z
    .instanceof(File, { message: "יש לבחור תמונה" })
    // superRefine – בדיקה עם הודעה משתנה (validateImage מחזיר את ההודעה המתאימה)
    .superRefine((file, ctx) => {
      const message = validateImage(file);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;
