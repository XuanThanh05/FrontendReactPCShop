// ============================================================
// StatisticsPage.jsx - API-driven statistics from backend
// Yêu cầu cài: npm install recharts
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "../../auth/useAuth";
import * as statisticsService from "../../../services/statisticsService";

import "./StatisticsPage.css";

// ---- Helpers ----
const formatVND = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const formatMillions = (val) => {
  if (!val) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
};

// ---- Component chính ----
export default function StatisticsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("name"); // "name", "category", "stockQuantity"
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" hoặc "desc"

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tất cả dữ liệu từ API
        const [summary, orderStatus, topProducts, warehouseReport] = await Promise.all([
          statisticsService.getSummaryStatistics(),
          statisticsService.getOrderStatusDistribution(),
          statisticsService.getTopProducts(),
          statisticsService.getWarehouseReport(),
        ]);

        setStats({
          totalRevenue: summary.totalRevenue || 0,
          totalOrders: summary.totalOrders || 0,
          totalCustomers: summary.totalCustomers || 0,
          orderStatus: orderStatus || [],
          topProducts: topProducts || [],
          warehouseReport: warehouseReport || [],
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err.message || "Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Hàm xử lý sắp xếp bảng kho hàng
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Nếu bấm cùng cột, đảo hướng sắp xếp
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Nếu bấm cột khác, set cột mới và hướng mặc định là asc
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sắp xếp dữ liệu kho hàng
  const getSortedWarehouseData = () => {
    if (!stats.warehouseReport) return [];
    
    const sorted = [...stats.warehouseReport].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortColumn) {
        case "name":
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case "category":
          compareA = a.category.toLowerCase();
          compareB = b.category.toLowerCase();
          break;
        case "stockQuantity":
          compareA = a.stockQuantity;
          compareB = b.stockQuantity;
          break;
        default:
          compareA = a.name;
          compareB = b.name;
      }
      
      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };

  if (loading) {
    return <div className="stats-page"><p>Đang tải...</p></div>;
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-topbar">
          <div className="stats-topbar-links">
            <Link to="/" className="stats-nav-btn">← Về trang chủ</Link>
            <Link to="/admin/users" className="stats-nav-btn">Quản lý user</Link>
          </div>
          <button type="button" className="stats-nav-btn danger" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
        <p style={{ color: "red", padding: "20px" }}>Lỗi: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="stats-page"><p>Không có dữ liệu</p></div>;
  }

  // Chuẩn bị dữ liệu cho Pie chart - chuyển từ API format
  const orderStatusData = stats.orderStatus
    ?.map((item) => {
      const statusColors = {
        PAID: "#10b981",
        PENDING: "#f59e0b",
        PROCESSING: "#3b82f6",
        SHIPPING: "#8b5cf6",
        COMPLETED: "#06b6d4",
        CANCELLED: "#ef4444",
      };
      return {
        name: item.status,
        value: item.count,
        color: statusColors[item.status] || "#94a3b8",
      };
    })
    .filter((item) => item.value > 0) || [];

  const maxSold = stats.topProducts?.length > 0 
    ? Math.max(...stats.topProducts.map(p => p.quantity))
    : 1;

  // Tính số lượng hàng tồn kho thấp (< 10 và > 0)
  const lowStockProducts = stats.warehouseReport?.filter(
    item => item.stockQuantity > 0 && item.stockQuantity < 10
  ).length || 0;

  return (
    <div className="stats-page">
      <div className="stats-topbar">
        <div className="stats-topbar-links">
          <Link to="/" className="stats-nav-btn">← Về trang chủ</Link>
          <Link to="/admin/users" className="stats-nav-btn">Quản lý user</Link>
        </div>
        <button type="button" className="stats-nav-btn danger" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {/* ---- Header ---- */}
      <div className="stats-header">
        <div>
          <h1>📊 Thống kê & Báo cáo</h1>
          <p>Tổng quan hoạt động kinh doanh — Cập nhật mới nhất</p>
        </div>
      </div>

      {/* ---- Summary Cards ---- */}
      <div className="summary-grid">
        <div className="summary-card blue">
          <div className="card-icon">💰</div>
          <div className="card-label">Tổng Doanh Thu</div>
          <div className="card-value">{formatMillions(stats.totalRevenue)}</div>
        </div>

        <div className="summary-card green">
          <div className="card-icon">🛒</div>
          <div className="card-label">Tổng Đơn Hàng</div>
          <div className="card-value">{stats.totalOrders}</div>
        </div>

        <div className="summary-card purple">
          <div className="card-icon">👥</div>
          <div className="card-label">Khách Hàng</div>
          <div className="card-value">{stats.totalCustomers}</div>
        </div>

        <div className="summary-card yellow">
          <div className="card-icon">⚠️</div>
          <div className="card-label">Hàng Tồn Kho Thấp</div>
          <div className="card-value">{lowStockProducts}</div>
        </div>
      </div>

      {/* ---- Order Status + Top Products ---- */}
      <div className="charts-grid">

        {/* Trạng thái đơn hàng */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Trạng Thái Đơn Hàng</h2>
            <span className="chart-badge green">Tổng: {stats.totalOrders}</span>
          </div>
          {orderStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: "#0f172a" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="order-legend">
                {orderStatusData.map((item, i) => (
                  <div className="order-legend-item" key={i}>
                    <span className="legend-left">
                      <span className="legend-dot" style={{ background: item.color }} />
                      {item.name}
                    </span>
                    <span className="legend-count">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-data">Chưa có dữ liệu</div>
          )}
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Sản Phẩm Bán Chạy</h2>
            <span className="chart-badge purple">Top {stats.topProducts.length}</span>
          </div>
          {stats.topProducts.length > 0 ? (
            <div className="product-list">
              {stats.topProducts.map((p, i) => (
                <div className="product-item" key={i}>
                  <span className="product-rank">#{i + 1}</span>
                  <div className="product-info">
                    <div className="product-name">{p.name}</div>
                    <div className="product-bar-wrap">
                      <div
                        className="product-bar"
                        style={{ width: `${(p.quantity / maxSold) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="product-sold">{p.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* ---- Warehouse Report ---- */}
      <div className="warehouse-card">
        <div className="chart-card-header">
          <h2>📦 Báo Cáo Kho Hàng</h2>
        </div>
        {stats.warehouseReport && stats.warehouseReport.length > 0 ? (
          <div className="warehouse-table-wrap">
            <table className="warehouse-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th 
                    className={`sortable ${sortColumn === "name" ? "sorted" : ""}`}
                    onClick={() => handleSort("name")}
                  >
                    Tên Sản Phẩm {sortColumn === "name" && (sortDirection === "asc" ? "↓" : "↑")}
                  </th>
                  <th 
                    className={`sortable ${sortColumn === "category" ? "sorted" : ""}`}
                    onClick={() => handleSort("category")}
                  >
                    Danh Mục {sortColumn === "category" && (sortDirection === "asc" ? "↓" : "↑")}
                  </th>
                  <th 
                    className={`sortable ${sortColumn === "stockQuantity" ? "sorted" : ""}`}
                    onClick={() => handleSort("stockQuantity")}
                  >
                    Tồn Kho {sortColumn === "stockQuantity" && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedWarehouseData().map((item, idx) => (
                  <tr key={item.id}>
                    <td className="col-id">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="col-name">{item.name}</td>
                    <td className="col-category"><span className="category-badge">{item.category}</span></td>
                    <td className="col-stock">
                      <span className={`stock-num ${
                        item.stockQuantity === 0 ? "danger" : 
                        item.stockQuantity < 10 ? "warn" : 
                        "ok"
                      }`}>
                        {item.stockQuantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">Chưa có dữ liệu</div>
        )}
      </div>

    </div>
  );
}
