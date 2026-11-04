import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
