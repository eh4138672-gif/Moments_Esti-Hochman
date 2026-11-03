import { z } from "zod";

// אותם כללים כמו בשרת (FRONTEND-API-GUIDE, סעיף 8)
export const loginSchema = z.object({
  email: z.string().trim().min(1, "שדה חובה").email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "שדה חובה").max(72, "הסיסמה ארוכה מדי"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
