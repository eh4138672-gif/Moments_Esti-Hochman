import { Link } from "react-router";

function Footer() {
  return (
    <footer className="mx-auto mb-4 w-[calc(100%-2rem)] max-w-6xl rounded-[2rem] border border-line bg-card px-8 py-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <span className="bg-gradient-to-l from-sky to-violet bg-clip-text font-display text-3xl font-extrabold text-transparent">
            moments
          </span>
          <p className="mt-3 max-w-xs text-muted">סטודיו לצילום ילדים ומשפחה. מהיכרות ראשונה ועד מסירת התמונות.</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <h4 className="mb-1 font-bold text-cream">האתר</h4>
          <Link to="/" className="hover:text-cream">דף הבית</Link>
          <Link to="/gallery" className="hover:text-cream">גלריית עבודות</Link>
          <Link to="/packages" className="hover:text-cream">חבילות</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <h4 className="mb-1 font-bold text-cream">לקוחות</h4>
          <Link to="/login" className="hover:text-cream">התחברות והרשמה</Link>
          <Link to="/my-projects" className="hover:text-cream">הפרויקטים שלי</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted">
          <h4 className="mb-1 font-bold text-cream">צור קשר</h4>

          <span>053-4138672</span>
          <span>eh4138672@gmail.com</span>
        </div>
      </div>

      <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
        © {new Date().getFullYear()} moments · אסתי הוכמן צלמת ילדים ומשפחה
      </p>
    </footer>
  );
}

export default Footer;
