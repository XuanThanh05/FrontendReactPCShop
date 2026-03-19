import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/homepage/Home";
import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import LogInPage from "../features/auth/login/LogInPage";
import RegisterPage from "../features/auth/register/RegisterPage";
import StatisticsPage from "../features/admin/statistics/StatisticsPage";
import SearchPage from "../features/searchpage/SearchPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/statistics" element={<StatisticsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}