import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/homepage/Home";
import LogInPage from "../features/auth/login/LogInPage";
import RegisterPage from "../features/auth/register/RegisterPage";
import StatisticsPage from "../features/admin/statistics/StatisticsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/statistics" element={<StatisticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}