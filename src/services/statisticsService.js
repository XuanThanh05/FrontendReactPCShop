import axiosClient from "./axiosClient";

/**
 * Lấy thống kê tóm tắt
 * @returns {Promise<{totalRevenue: number, totalOrders: number, totalCustomers: number}>}
 */
export async function getSummaryStatistics() {
  try {
    const response = await axiosClient.get("/admin/statistics/summary", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching summary statistics:", error);
    throw new Error("Không thể tải thống kê tóm tắt.");
  }
}

/**
 * Lấy phân bố trạng thái đơn hàng
 * @returns {Promise<Array<{status: string, count: number}>>}
 */
export async function getOrderStatusDistribution() {
  try {
    const response = await axiosClient.get("/admin/statistics/order-status", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching order status distribution:", error);
    throw new Error("Không thể tải phân bố trạng thái đơn hàng.");
  }
}

/**
 * Lấy top sản phẩm bán chạy nhất
 * @returns {Promise<Array<{id: number, name: string, category: string, quantity: number}>>}
 */
export async function getTopProducts() {
  try {
    const response = await axiosClient.get("/admin/statistics/top-products", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw new Error("Không thể tải danh sách sản phẩm bán chạy.");
  }
}

/**
 * Lấy báo cáo kho hàng
 * @returns {Promise<Array<{id: number, name: string, category: string, stockQuantity: number}>>}
 */
export async function getWarehouseReport() {
  try {
    const response = await axiosClient.get("/admin/statistics/warehouse-report", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse report:", error);
    throw new Error("Không thể tải báo cáo kho hàng.");
  }
}
