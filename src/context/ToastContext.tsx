import { createContext, useCallback, useState, type ReactNode } from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue | null>(null);

// הודעות קופצות קטנות ("הפרויקט נשמר ✓"). כל קומפוננטה קוראת ל־showToast דרך useToast,
// וה־Provider מציג את ההודעות בתחתית המסך ומעלים כל אחת אחרי 3 שניות
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // useCallback – אותה פונקציה בכל רינדור, כדי שאפשר יהיה להשתמש בה בתוך useEffect / mutations
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* aria-live – קורא מסך מקריא הודעה חדשה בלי שצריך להגיע אליה */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <p
            key={toast.id}
            className={`rounded-full border px-6 py-3 font-bold shadow-xl shadow-black/40 ${
              toast.type === "success" ? "border-sky/40 bg-card text-cream" : "border-rose/50 bg-card text-rose"
            }`}
          >
            {toast.type === "success" ? "✓ " : "⚠ "}
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
