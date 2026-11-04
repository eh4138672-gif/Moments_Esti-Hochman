import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getApiError } from "./apiError";

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  conflictField?: Path<T>,
) {
  const apiError = getApiError(error);

  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      setError(field as Path<T>, { message: messages[0] });
    });
    return;
  }

  if (apiError.status === 409 && conflictField) {
    setError(conflictField, { message: apiError.title });
    return;
  }

  setError("root", { message: apiError.title });
}
