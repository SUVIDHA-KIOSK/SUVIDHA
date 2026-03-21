import { Route, Routes } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import LoginPage from "../../pages/auth/LoginPage";
import HomePage from "../../pages/home/HomePage";
import NotFoundPage from "../../pages/not-found/NotFoundPage";
import ProfilePage from "../../pages/profile/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
