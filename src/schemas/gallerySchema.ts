import { z } from "zod";
import { validateImage } from "../utils/validateImage";

export const gallerySchema = z.object({
  title: z.string().trim().min(2, "לפחות 2 תווים").max(80, "עד 80 תווים"),
  category: z.enum(["Babies", "FirstBirthday", "Upsherin", "Family", "Albums"], { errorMap: () => ({ message: "יש לבחור קטגוריה" }) }),
  file: z
    .instanceof(File, { message: "יש לבחור תמונה" })
    .superRefine((file, ctx) => {
      const message = validateImage(file);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;
