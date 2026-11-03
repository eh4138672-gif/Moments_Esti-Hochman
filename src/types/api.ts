// כל שגיאה מהשרת מגיעה במבנה הזה:
// { "status": 400, "title": "נתונים לא תקינים", "errors": { "clientEmail": ["כתובת אימייל לא תקינה"] } }
export interface ApiError {
  status: number;
  title: string;
  // רק בשגיאות ולידציה: שם השדה ← רשימת הודעות (אפשר להציג ליד השדה בטופס)
  errors?: Record<string, string[]>;
}
