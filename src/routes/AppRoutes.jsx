import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatisticsPage from "../features/admin/statistics/StatisticsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/statistics" element={<StatisticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}