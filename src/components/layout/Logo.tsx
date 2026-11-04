import { Link } from "react-router";
import { SparkleIcon } from "../ui/icons";

interface LogoProps {
  subtitle?: string;
}

function Logo({ subtitle }: LogoProps) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-full border-2 border-sun text-sun">
        <SparkleIcon size={20} />
      </span>
      <span className="leading-tight">
        <span className="block bg-gradient-to-r from-sun via-rose to-violet bg-clip-text font-display text-xl font-extrabold text-transparent">
          moments
        </span>
        {subtitle && <span className="block text-sm text-muted">{subtitle}</span>}
      </span>
    </Link>
  );
}

export default Logo;
