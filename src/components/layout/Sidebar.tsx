import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { GridIcon, ImageIcon, LogOutIcon, PlusCircleIcon } from "../ui/icons";
import { useAuth } from "../../hooks/useAuth";
import Logo from "./Logo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
    isActive ? "bg-gradient-to-l from-sun/20 to-berry/20 font-bold text-cream" : "text-cream/80 hover:bg-card"
  }`;

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <aside className="flex flex-col gap-6 border-b border-line bg-[#201f25] p-4 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:gap-8 md:border-b-0 md:border-s md:p-6">
      <div className="flex items-center justify-between">
        <Logo subtitle="ממשק ניהול" />
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="תפריט"
          className="grid size-10 place-items-center rounded-full border border-line text-xl md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className={`flex-col gap-1 ${menuOpen ? "flex" : "hidden"} md:flex`}>
        <NavLink to="/admin/projects" end className={linkClass} onClick={closeMenu}>
          <GridIcon /> כל הפרויקטים
        </NavLink>
        <NavLink to="/admin/projects/new" className={linkClass} onClick={closeMenu}>
          <PlusCircleIcon /> הוספת פרויקט
        </NavLink>
        <NavLink to="/admin/gallery" className={linkClass} onClick={closeMenu}>
          <ImageIcon /> ניהול גלריה
        </NavLink>
      </nav>

      <div className={`items-center gap-3 border-t border-line pt-5 md:mt-auto md:flex ${menuOpen ? "flex" : "hidden"}`}>
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-l from-sun to-berry font-bold text-ink">
          {user?.fullName.charAt(0)}
        </span>
        <div className="flex-1 leading-tight">
          <span className="block font-bold">{user?.fullName}</span>
          <span className="text-sm text-muted">הרשאת ניהול מלאה</span>
        </div>
        <button type="button" onClick={handleLogout} title="יציאה" className="text-muted transition hover:text-rose">
          <LogOutIcon />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
