import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

// המסגרת של ממשק הניהול: סרגל צד קבוע + התוכן
function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      {/* min-w-0 – בלעדיו, טבלה רחבה "מותחת" את כל הדף בטלפון במקום לגלול בתוך עצמה */}
      <main className="min-w-0 flex-1 p-4 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
