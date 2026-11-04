import { Navigate, Route, Routes } from "react-router";

import SiteLayout from "../components/layout/SiteLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/public/HomePage";
import GalleryPage from "../pages/public/GalleryPage";
import PackagesPage from "../pages/public/PackagesPage";
import AuthPage from "../pages/public/AuthPage";
import MyProjectsPage from "../pages/client/MyProjectsPage";
import ProjectPage from "../pages/client/ProjectPage";
import AdminProjectsPage from "../pages/admin/AdminProjectsPage";
import ProjectFormPage from "../pages/admin/ProjectFormPage";
import AdminGalleryPage from "../pages/admin/AdminGalleryPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        <Route element={<ProtectedRoute role="Client" />}>
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/my-projects/:id" element={<ProjectPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute role="Admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/projects/new" element={<ProjectFormPage />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectFormPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
