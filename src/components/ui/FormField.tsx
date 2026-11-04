import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

function FormField({ label, registration, error, ...inputProps }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        {...inputProps}
        {...registration}
        aria-invalid={!!error}
        className={`w-full rounded-2xl border bg-ink px-4 py-3 text-cream outline-none transition placeholder:text-muted/70 focus:border-violet ${
          error ? "border-rose" : "border-line"
        }`}
      />
      {error && <span className="mt-1.5 block text-sm text-rose">{error.message}</span>}
    </label>
  );
}

export default FormField;
