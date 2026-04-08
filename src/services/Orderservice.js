import axiosClient from "./axiosClient";

function normalizeApiError(error, fallbackMessage) {
  const responseData = error?.response?.data;
  const responseMessage = responseData?.message;
  const statusText = error?.response?.statusText;

  if (responseMessage && typeof responseMessage === "string") return responseMessage;

  if (responseData && typeof responseData === "object") {
    const firstValue = Object.values(responseData)[0];
    if (typeof firstValue === "string" && firstValue.trim()) return firstValue;
  }

  if (statusText && typeof statusText === "string") return statusText;

  return fallbackMessage;
}

/**
 * POST /orders
 * @param {Object} payload - CreateOrderRequest shape
 * @returns {Promise<CreateOrderResponse>} { orderId, status, totalAmount, createdAt }
 */
export async function createOrder(payload) {
  try {
    const response = await axiosClient.post("/orders", payload);
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error, "Đặt hàng thất bại. Vui lòng thử lại."));
  }
}

/**
 * GET /orders/my-history
 * @returns {Promise<OrderHistoryItemResponse[]>}
 */
export async function getMyOrderHistory() {
  try {
    const response = await axiosClient.get("/orders/my-history");
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể tải lịch sử đơn hàng."));
  }
}

/**
 * GET /orders/:id/tracking
 * @param {number} orderId
 * @returns {Promise<TrackingResponse>}
 */
export async function getOrderTracking(orderId) {
  try {
    const response = await axiosClient.get(`/orders/${orderId}/tracking`);
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể tải thông tin tracking."));
  }
}

/**
 * PUT /orders/:id/shipper-location
 * @param {number} orderId
 * @param {{ latitude: number, longitude: number }} location
 */
export async function updateShipperLocation(orderId, { latitude, longitude }) {
  try {
    await axiosClient.put(`/orders/${orderId}/shipper-location`, { latitude, longitude });
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể cập nhật vị trí shipper."));
  }
}