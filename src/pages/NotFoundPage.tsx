import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-7xl font-extrabold text-rose">404</h1>
      <p className="mt-4 text-muted">הדף שחיפשתם לא נמצא.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-gradient-to-l from-berry to-sun px-6 py-2.5 font-bold text-ink">
        חזרה לדף הבית
      </Link>
    </div>
  );
}

export default NotFoundPage;
