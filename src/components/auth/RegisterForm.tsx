import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "../../schemas/registerSchema";
import { applyServerErrors } from "../../utils/applyServerErrors";
import type { User } from "../../types/user";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

interface RegisterFormProps {
  onSuccess: (user: User) => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    const { fullName, email, phone, password } = values;
    try {
      const user = await registerUser({ fullName, email, phone, password });
      onSuccess(user);
    } catch (error) {
      applyServerErrors(error, setError, "email");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="שם מלא" placeholder="דנה לוי" autoComplete="name" registration={register("fullName")} error={errors.fullName} />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="אימייל" type="email" placeholder="name@example.com" autoComplete="email" registration={register("email")} error={errors.email} />
        <FormField label="טלפון" type="tel" placeholder="050-1234567" autoComplete="tel" registration={register("phone")} error={errors.phone} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="סיסמה" type="password" placeholder="לפחות 8 תווים" autoComplete="new-password" registration={register("password")} error={errors.password} />
        <FormField label="אימות סיסמה" type="password" autoComplete="new-password" registration={register("confirmPassword")} error={errors.confirmPassword} />
      </div>

      {errors.root && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{errors.root.message}</p>}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        הרשמה
      </Button>

      <p className="text-center text-sm text-muted">
        נרשמים עם אותו אימייל שמסרתם לסטודיו – והפרויקטים שלכם יופיעו אוטומטית.
      </p>
    </form>
  );
}

export default RegisterForm;
