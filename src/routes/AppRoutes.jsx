import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/homepage/Home";

const LogInPage = lazy(() => import("../features/auth/login/LogInPage"));
const RegisterPage = lazy(() => import("../features/auth/register/RegisterPage"));
const StatisticsPage = lazy(() => import("../features/admin/statistics/StatisticsPage"));

function PageLoader() {
  return (
    <div style={{ minHeight: "40vh", display: "grid", placeItems: "center", color: "#64748b", fontWeight: 600 }}>
      Đang tải trang...
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/statistics" element={<StatisticsPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}