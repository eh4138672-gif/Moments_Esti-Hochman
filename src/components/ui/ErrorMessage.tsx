import { getApiError } from "../../utils/apiError";
import Button from "./Button";

interface ErrorMessageProps {
  error: unknown; // השגיאה כמו שהיא מגיעה מ־React Query (error)
  onRetry?: () => void; // בדרך כלל refetch – אם יש, מוצג כפתור "נסו שוב"
}

// הודעת שגיאה כשטעינת מידע נכשלה. הטקסט מגיע מהשרת (title), או הודעה כללית
function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const { title } = getApiError(error);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose/40 bg-rose/5 px-6 py-10 text-center" role="alert">
      <p className="text-lg font-bold text-rose">{title}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          נסו שוב
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;
