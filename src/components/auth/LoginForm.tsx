import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../../schemas/loginSchema";
import { applyServerErrors } from "../../utils/applyServerErrors";
import type { User } from "../../types/user";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

interface LoginFormProps {
  onSuccess: (user: User) => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      const user = await login(values);
      onSuccess(user);
    } catch (error) {
      applyServerErrors(error, setError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="אימייל" type="email" placeholder="name@example.com" autoComplete="email" registration={register("email")} error={errors.email} />
      <FormField label="סיסמה" type="password" placeholder="לפחות 8 תווים" autoComplete="current-password" registration={register("password")} error={errors.password} />

      {errors.root && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{errors.root.message}</p>}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        כניסה לאזור האישי
      </Button>

      <p className="text-center text-sm text-muted">
        עדיין לא נרשמתם?{" "}
        <Link to="/register" replace className="text-cream underline-offset-4 hover:underline">
          עברו ללשונית הרשמה
        </Link>
        .
      </p>
    </form>
  );
}

export default LoginForm;
