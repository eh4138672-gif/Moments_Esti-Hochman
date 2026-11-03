import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import type { User } from "../../types/user";

// לאן שולחים משתמש אחרי התחברות: לדף שניסה להגיע אליו (אם מותר לו), אחרת לדף הבית שלו
function homeFor(user: User, from?: string) {
  if (user.role === "Admin") return from?.startsWith("/admin") ? from : "/admin/projects";
  return from?.startsWith("/my-projects") ? from : "/my-projects";
}

// /login ו־/register – אותו דף, הטאב נקבע לפי הכתובת
function AuthPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";
  // ProtectedRoute שומר כאן לאן ניסו להגיע לפני שהועברו להתחברות
  const from = (location.state as { from?: string } | null)?.from;

  function handleSuccess(loggedIn: User) {
    navigate(homeFor(loggedIn, from), { replace: true });
  }

  // מי שכבר מחובר לא צריך את הדף הזה
  if (!isLoading && user) {
    return <Navigate to={homeFor(user)} replace />;
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-full py-2.5 text-center font-bold transition ${active ? "bg-line text-cream" : "text-muted hover:text-cream"}`;

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-line bg-card md:grid-cols-2">
      <div className="p-8 md:p-12">
        <h1 className="text-4xl font-extrabold md:text-5xl">ברוכים הבאים</h1>
        <p className="mt-3 text-lg text-muted">התחברו כדי לראות את הפרויקטים שלכם, או הירשמו אחרי סגירת הצילום.</p>

        <div className="mt-8 flex rounded-full bg-ink p-1.5">
          {/* replace – מעבר בין טאבים לא מוסיף עוד צעד להיסטוריה של "חזרה" */}
          <Link to="/login" replace state={location.state} className={tabClass(!isRegister)}>
            התחברות
          </Link>
          <Link to="/register" replace state={location.state} className={tabClass(isRegister)}>
            הרשמה
          </Link>
        </div>

        <div className="mt-8">
          {isRegister ? <RegisterForm onSuccess={handleSuccess} /> : <LoginForm onSuccess={handleSuccess} />}
        </div>
      </div>

      {/* צד התמונה – רק במסך רחב */}
      <div className="relative hidden min-h-[32rem] bg-black md:block">
        {/* תמונה קבועה מתיקיית public – נכנסת לאתר יחד עם הקוד.
            object-contain = מציגים את כל התמונה בלי לחתוך (היא רחבה, והרקע השחור שלה מתמזג עם הפאנל) */}
        <img src="/images/auth.jpg" alt="אלבומי תמונות של moments" className="absolute inset-0 size-full object-contain px-6 pb-24" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <div className="absolute inset-x-10 bottom-10">
          <span className="bg-gradient-to-r from-violet to-sky bg-clip-text font-display text-4xl font-extrabold text-transparent">
            moments
          </span>
          <p className="mt-2 text-lg">הפרויקטים, הסטטוסים והאלבום שלכם – במקום אחד.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
