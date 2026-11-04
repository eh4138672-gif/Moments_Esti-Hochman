export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `"${file.name}" – אפשר להעלות רק jpg, png או webp`;
  if (file.size > MAX_IMAGE_SIZE) return `"${file.name}" גדול מ־10MB`;
  return null;
}
