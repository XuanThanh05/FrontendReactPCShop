// ============================================================
// StatisticsPage.jsx
// Yêu cầu cài: npm install recharts
// ============================================================

import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts";

import {
  summaryStats,
  revenueByMonth,
  orderStatusData,
  orderStats,
  topProducts,
  warehouseReport,
  newCustomersByMonth,
} from "./mockData";

import "./StatisticsPage.css";

// ---- Helpers ----
const formatVND = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

const formatMillions = (val) => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} tỷ`;
  if (val >= 1_000_000)     return `${(val / 1_000_000).toFixed(0)} tr`;
  return val.toString();
};

// ---- Custom Tooltip cho biểu đồ ----
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c2333", border: "1px solid #30363d", borderRadius: 8, padding: "10px 16px" }}>
      <p style={{ color: "#8b949e", fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#58a6ff", fontFamily: "Space Mono, monospace", fontWeight: 700 }}>
        {formatVND(payload[0].value)}
      </p>
    </div>
  );
};

const CustomerTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c2333", border: "1px solid #30363d", borderRadius: 8, padding: "10px 16px" }}>
      <p style={{ color: "#8b949e", fontSize: 12, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#bc8cff", fontFamily: "Space Mono, monospace", fontWeight: 700 }}>
        {payload[0].value} khách mới
      </p>
    </div>
  );
};

// ---- Component chính ----
export default function StatisticsPage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const maxSold = Math.max(...topProducts.map((p) => p.sold));

  const getStockStatus = (item) => {
    if (item.stock === 0)           return "danger";
    if (item.stock < item.minStock) return "warn";
    return "ok";
  };

  const getStatusLabel = (item) => {
    if (item.stock === 0)           return "Hết hàng";
    if (item.stock < item.minStock) return "Sắp hết";
    return "Còn hàng";
  };

  return (
    <div className="stats-page">

      {/* ---- Header ---- */}
      <div className="stats-header">
        <div>
          <h1>📊 Thống kê & Báo cáo</h1>
          <p>Tổng quan hoạt động kinh doanh — Cập nhật mới nhất</p>
        </div>
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2024">Năm 2024</option>
          <option value="2023">Năm 2023</option>
        </select>
      </div>

      {/* ---- Summary Cards ---- */}
      <div className="summary-grid">
        <div className="summary-card blue">
          <div className="card-icon">💰</div>
          <div className="card-label">Tổng Doanh Thu</div>
          <div className="card-value">{formatMillions(summaryStats.totalRevenue)}</div>
          <div className="card-growth up">
            ▲ {summaryStats.revenueGrowth}% so với tháng trước
          </div>
        </div>

        <div className="summary-card green">
          <div className="card-icon">🛒</div>
          <div className="card-label">Tổng Đơn Hàng</div>
          <div className="card-value">{summaryStats.totalOrders}</div>
          <div className="card-growth up">
            ▲ {summaryStats.orderGrowth}% so với tháng trước
          </div>
        </div>

        <div className="summary-card purple">
          <div className="card-icon">👥</div>
          <div className="card-label">Khách Hàng</div>
          <div className="card-value">{summaryStats.totalCustomers}</div>
          <div className="card-growth up">
            ▲ {summaryStats.customerGrowth}% so với tháng trước
          </div>
        </div>

        <div className="summary-card yellow">
          <div className="card-icon">📦</div>
          <div className="card-label">Sản Phẩm Sắp Hết</div>
          <div className="card-value">{summaryStats.lowStockItems}</div>
          <div className="card-growth warn">
            ⚠ Cần nhập thêm hàng
          </div>
        </div>
      </div>

      {/* ---- Revenue Chart + Order Status ---- */}
      <div className="charts-grid">

        {/* Doanh thu theo tháng */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Doanh Thu Theo Tháng</h2>
            <span className="chart-badge blue">{selectedYear}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
              <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatMillions} tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<RevenueTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#58a6ff"
                strokeWidth={2.5}
                dot={{ fill: "#58a6ff", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#58a6ff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Trạng Thái Đơn Hàng</h2>
            <span className="chart-badge green">Tổng: {orderStats.total}</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1c2333", border: "1px solid #30363d", borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: "#e6edf3" }}
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
        </div>
      </div>

      {/* ---- Top Products + Customers ---- */}
      <div className="charts-grid-2">

        {/* Sản phẩm bán chạy */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Sản Phẩm Bán Chạy</h2>
            <span className="chart-badge purple">Top {topProducts.length}</span>
          </div>
          <div className="product-list">
            {topProducts.map((p, i) => (
              <div className="product-item" key={i}>
                <span className="product-rank">#{i + 1}</span>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-bar-wrap">
                    <div
                      className="product-bar"
                      style={{ width: `${(p.sold / maxSold) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="product-sold">{p.sold}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Khách hàng mới theo tháng */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h2>Khách Hàng Mới Theo Tháng</h2>
            <span className="chart-badge yellow">{selectedYear}</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={newCustomersByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
              <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomerTooltip />} />
              <Bar dataKey="customers" fill="#bc8cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Warehouse Report ---- */}
      <div className="warehouse-card">
        <div className="chart-card-header">
          <h2>📦 Báo Cáo Kho Hàng</h2>
          <span className="chart-badge yellow">
            {warehouseReport.filter(i => i.stock < i.minStock).length} sản phẩm cần nhập
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên Sản Phẩm</th>
              <th>Danh Mục</th>
              <th>Đã Nhập</th>
              <th>Đã Bán</th>
              <th>Tồn Kho</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {warehouseReport.map((item) => {
              const s = getStockStatus(item);
              return (
                <tr key={item.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "Space Mono, monospace", fontSize: 12 }}>
                    {String(item.id).padStart(2, "0")}
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td><span className="category-badge">{item.category}</span></td>
                  <td style={{ fontFamily: "Space Mono, monospace" }}>{item.imported}</td>
                  <td style={{ fontFamily: "Space Mono, monospace" }}>{item.sold}</td>
                  <td>
                    <span className={`stock-num ${s}`}>{item.stock}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11, marginLeft: 4 }}>
                      (min: {item.minStock})
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${s}`}>{getStatusLabel(item)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
