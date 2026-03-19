import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/homepage/Home";
import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import LogInPage from "../features/auth/login/LogInPage";
import RegisterPage from "../features/auth/register/RegisterPage";
import StatisticsPage from "../features/admin/statistics/StatisticsPage";
import SearchPage from "../features/searchpage/SearchPage";
import UserManagementPage from "../features/admin/usermanagement/UserManagementPage";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/statistics" element={<StatisticsPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}