// ============================================================
// MOCK DATA - Thay bằng API call khi có backend
// ============================================================

// --- Tổng quan (Summary Cards) ---
export const summaryStats = {
  totalRevenue: 485000000,       // VND
  revenueGrowth: 12.5,           // % so với tháng trước
  totalOrders: 342,
  orderGrowth: 8.3,
  totalCustomers: 198,
  customerGrowth: 5.1,
  lowStockItems: 7,              // Sản phẩm sắp hết hàng
};

// --- Doanh thu theo tháng ---
export const revenueByMonth = [
  { month: "T1", revenue: 28000000 },
  { month: "T2", revenue: 35000000 },
  { month: "T3", revenue: 31000000 },
  { month: "T4", revenue: 42000000 },
  { month: "T5", revenue: 39000000 },
  { month: "T6", revenue: 51000000 },
  { month: "T7", revenue: 47000000 },
  { month: "T8", revenue: 55000000 },
  { month: "T9", revenue: 49000000 },
  { month: "T10", revenue: 62000000 },
  { month: "T11", revenue: 58000000 },
  { month: "T12", revenue: 75000000 },
];

// --- Thống kê đơn hàng ---
export const orderStats = {
  total: 342,
  pending: 28,       // Chờ xác nhận
  processing: 45,    // Đang xử lý
  shipping: 37,      // Đang giao
  completed: 210,    // Hoàn thành
  cancelled: 22,     // Đã hủy
};

export const orderStatusData = [
  { name: "Hoàn thành", value: 210, color: "#10b981" },
  { name: "Đang xử lý", value: 45,  color: "#3b82f6" },
  { name: "Đang giao",  value: 37,  color: "#f59e0b" },
  { name: "Chờ xác nhận", value: 28, color: "#8b5cf6" },
  { name: "Đã hủy",    value: 22,  color: "#ef4444" },
];

// --- Sản phẩm bán chạy ---
export const topProducts = [
  { name: "Laptop ASUS ROG Strix G16",   sold: 48, revenue: 96000000,  category: "Laptop" },
  { name: "RAM Kingston Fury 16GB DDR5", sold: 87, revenue: 26100000,  category: "Phụ kiện" },
  { name: "Laptop Dell XPS 15",          sold: 35, revenue: 105000000, category: "Laptop" },
  { name: "SSD Samsung 1TB NVMe",        sold: 72, revenue: 21600000,  category: "Phụ kiện" },
  { name: "PC Gaming RTX 4060",          sold: 24, revenue: 96000000,  category: "PC" },
  { name: "Màn hình LG 27\" 144Hz",      sold: 41, revenue: 45100000,  category: "Phụ kiện" },
];

// --- Báo cáo kho hàng ---
export const warehouseReport = [
  { id: 1, name: "Laptop ASUS ROG Strix G16",   category: "Laptop",    stock: 12, minStock: 5,  status: "Còn hàng",    imported: 30, sold: 48 },
  { id: 2, name: "Laptop Dell XPS 15",          category: "Laptop",    stock: 4,  minStock: 5,  status: "Sắp hết",     imported: 20, sold: 35 },
  { id: 3, name: "PC Gaming RTX 4060",          category: "PC",        stock: 8,  minStock: 3,  status: "Còn hàng",    imported: 15, sold: 24 },
  { id: 4, name: "RAM Kingston Fury 16GB DDR5", category: "Phụ kiện",  stock: 2,  minStock: 10, status: "Sắp hết",     imported: 100, sold: 87 },
  { id: 5, name: "SSD Samsung 1TB NVMe",        category: "Phụ kiện",  stock: 0,  minStock: 10, status: "Hết hàng",    imported: 80, sold: 72 },
  { id: 6, name: "Màn hình LG 27\" 144Hz",      category: "Phụ kiện",  stock: 15, minStock: 5,  status: "Còn hàng",    imported: 50, sold: 41 },
  { id: 7, name: "Chuột Logitech G502 X",       category: "Phụ kiện",  stock: 3,  minStock: 10, status: "Sắp hết",     imported: 60, sold: 55 },
  { id: 8, name: "Bàn phím Corsair K70",        category: "Phụ kiện",  stock: 22, minStock: 5,  status: "Còn hàng",    imported: 40, sold: 18 },
];

// --- Khách hàng mới theo tháng ---
export const newCustomersByMonth = [
  { month: "T1",  customers: 12 },
  { month: "T2",  customers: 18 },
  { month: "T3",  customers: 15 },
  { month: "T4",  customers: 22 },
  { month: "T5",  customers: 19 },
  { month: "T6",  customers: 27 },
  { month: "T7",  customers: 24 },
  { month: "T8",  customers: 31 },
  { month: "T9",  customers: 28 },
  { month: "T10", customers: 35 },
  { month: "T11", customers: 32 },
  { month: "T12", customers: 42 },
];
