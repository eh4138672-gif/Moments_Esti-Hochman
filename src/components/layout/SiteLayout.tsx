import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Navbar />

      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;
