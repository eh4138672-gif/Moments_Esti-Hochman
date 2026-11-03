import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types/user";

interface ProtectedRouteProps {
  role: Role; // התפקיד שמותר לו להיכנס
}

// שומר על נתיבים: לא מחובר → /login, תפקיד לא מתאים → דף הבית
function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // עדיין בודקים את הטוקן מול /auth/me – לא מחליטים כלום לפני שיודעים מי המשתמש
  if (isLoading) {
    return <p className="py-16 text-center text-muted">טוען...</p>;
  }

  if (!user) {
    // שומרים לאן ניסו להגיע, כדי שאחרי ההתחברות אפשר יהיה לחזור לשם
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
