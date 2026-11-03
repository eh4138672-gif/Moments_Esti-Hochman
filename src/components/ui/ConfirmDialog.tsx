import { useEffect } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string; // למשל "למחוק את הפרויקט?"
  message?: string;
  confirmLabel?: string;
  isLoading?: boolean; // בזמן המחיקה – הכפתור ננעל עם ספינר
  onConfirm: () => void;
  onCancel: () => void;
}

// חלון אישור לפני פעולה שאי אפשר לבטל (מחיקה)
function ConfirmDialog({ open, title, message, confirmLabel = "מחיקה", isLoading = false, onConfirm, onCancel }: ConfirmDialogProps) {
  // Escape סוגר את החלון
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey); // ניקוי כשהחלון נסגר
  }, [open, onCancel]);

  if (!open) return null;

  return (
    // לחיצה על הרקע הכהה סוגרת; stopPropagation – לחיצה בתוך החלון לא "מגיעה" לרקע
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-3xl border border-line bg-card p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-2xl font-extrabold">{title}</h2>
        {message && <p className="mt-3 text-muted">{message}</p>}

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            ביטול
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
