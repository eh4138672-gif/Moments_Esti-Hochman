// "2026-09-14" → "14.09.2026"
// מפרקים את המחרוזת במקום new Date() – כך התאריך לא "זז" ביום בגלל אזורי זמן.
export function formatDate(dateOnly: string): string {
  const [year, month, day] = dateOnly.slice(0, 10).split("-");
  if (!year || !month || !day) return dateOnly;
  return `${day}.${month}.${year}`;
}
