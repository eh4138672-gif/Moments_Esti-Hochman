import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

// const { showToast } = useToast();  →  showToast("הפרויקט נשמר")  או  showToast("משהו השתבש", "error")
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast חייב להיות בתוך ToastProvider");
  }
  return ctx;
}
