import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger";
  isLoading?: boolean;
}

const variants = {
  primary: "bg-gradient-to-l from-berry to-sun text-ink hover:opacity-90",
  outline: "border border-line text-cream hover:border-rose",
  danger: "bg-rose text-ink hover:opacity-90",
};

function Button({ variant = "primary", isLoading = false, disabled, className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {isLoading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

export default Button;
