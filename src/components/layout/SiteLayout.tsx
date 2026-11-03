import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

// המסגרת של האתר הפתוח והאזור האישי. Outlet = המקום שבו נכנס הדף הנוכחי
function SiteLayout() {
  const { pathname } = useLocation();

  // במעבר לדף אחר – חוזרים לראש הדף (אחרת הדפדפן נשאר באותה נקודת גלילה)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Navbar />
      {/* min-h-screen – התוכן תופס לפחות מסך שלם, כך שהפוטר מופיע רק כשגוללים לסוף הדף */}
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;
