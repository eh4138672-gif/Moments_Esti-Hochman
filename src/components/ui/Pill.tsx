import type { ButtonHTMLAttributes } from "react";

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Pill({ active = false, className = "", children, ...rest }: PillProps) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={active}
      className={`rounded-full border px-5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-transparent bg-gradient-to-l from-berry to-sun text-ink" : "border-line text-cream/80 hover:border-rose"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Pill;
