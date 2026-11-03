import axios from "axios";
import type { ApiError } from "../types/api";

/**
 * מוציא מכל שגיאה (של axios או אחרת) אובייקט ApiError אחיד: { status, title, errors? }
 * שימושי בטפסים – error.errors.email[0] היא ההודעה לשדה האימייל,
 * ובכל מסך – error.title היא הודעה כללית להצגה.
 */
export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiError> | undefined;
    if (data?.title) {
      return { status: data.status ?? error.response?.status ?? 0, title: data.title, errors: data.errors };
    }
    if (!error.response) {
      // השרת לא ענה בכלל (כבוי / אין אינטרנט / CORS)
      return { status: 0, title: "אין חיבור לשרת – נסו שוב בעוד רגע" };
    }
    return { status: error.response.status, title: "אירעה שגיאה – נסו שוב" };
  }
  return { status: 0, title: "אירעה שגיאה לא צפויה" };
}
