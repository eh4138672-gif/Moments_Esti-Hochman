import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition hover:text-cream ${isActive ? "text-rose" : "text-cream/80"}`;

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-4 z-20 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl border border-line bg-card/80 px-4 py-3 backdrop-blur md:gap-x-8 md:rounded-full md:px-6">
      <Logo />

      <nav className="order-last flex basis-full flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium md:order-none md:flex-1 md:basis-auto md:gap-x-8">
        <NavLink to="/" end className={linkClass}>דף הבית</NavLink>
        <NavLink to="/gallery" className={linkClass}>גלריית עבודות</NavLink>
        <NavLink to="/packages" className={linkClass}>חבילות</NavLink>
        {isAdmin ? (
          <NavLink to="/admin/projects" className={linkClass}>ממשק ניהול</NavLink>
        ) : (
          <NavLink to="/my-projects" className={linkClass}>האזור האישי</NavLink>
        )}
      </nav>

      {user ? (
        <div className="ms-auto flex items-center gap-3 text-sm md:ms-0">
          <span className="hidden text-muted sm:inline">שלום, {user.fullName}</span>

          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-l from-sun to-berry font-bold text-ink">
            {user.fullName.charAt(0)}
          </span>
          <button type="button" onClick={handleLogout} className="rounded-full border border-line px-4 py-1.5 transition hover:border-rose">
            יציאה
          </button>
        </div>
      ) : (
        <Link to="/login" className="ms-auto rounded-full bg-gradient-to-l from-berry to-sun px-5 py-2 text-sm font-bold text-ink transition hover:opacity-90">
          התחברות
        </Link>
      )}
    </header>
  );
}

export default Navbar;
