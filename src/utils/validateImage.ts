// אותם כללים כמו בשרת: רק jpg / png / webp, עד 10MB לתמונה.
// בודקים כבר בדפדפן – כדי לא לחכות להעלאה של קובץ גדול רק כדי לקבל שגיאה
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB בבתים

// מחזיר הודעת שגיאה, או null אם הקובץ תקין
export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `"${file.name}" – אפשר להעלות רק jpg, png או webp`;
  if (file.size > MAX_IMAGE_SIZE) return `"${file.name}" גדול מ־10MB`;
  return null;
}
