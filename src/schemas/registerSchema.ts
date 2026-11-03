import { z } from "zod";

// אותם כללים כמו בשרת, ועוד "אימות סיסמה" שנבדק רק כאן ולא נשלח לשרת
export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "לפחות 2 תווים").max(60, "עד 60 תווים"),
    email: z.string().trim().min(1, "שדה חובה").email("כתובת אימייל לא תקינה"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9-]{9,15}$/, "מספר טלפון לא תקין (9–15 ספרות, מותר + ו־-)"),
    password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים").max(72, "עד 72 תווים"),
    confirmPassword: z.string().min(1, "שדה חובה"),
  })
  // refine – בדיקה שמשווה בין שני שדות. path קובע ליד איזה שדה תופיע ההודעה
  .refine((data) => data.password === data.confirmPassword, {
    message: "הסיסמאות לא תואמות",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
