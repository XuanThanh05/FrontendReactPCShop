import axiosClient from "./axiosClient";

// axiosClient baseURL phải là http://localhost:8080/api
// Tất cả endpoint dùng JWT qua Authorization header (axiosClient interceptor tự đính kèm)

const cartService = {
  /**
   * GET /api/cart?page=0&size=10
   * Lấy giỏ hàng của user đang đăng nhập (phân trang)
   */
  getCart: (page = 0, size = 100) =>
    axiosClient.get("/cart", { params: { page, size } }),

  /**
   * POST /api/cart/items
   * Thêm sản phẩm vào giỏ hàng
   * @param {number} productId
   * @param {number} quantity
   */
  addToCart: (productId, quantity = 1) =>
    axiosClient.post("/cart/items", { productId, quantity }),

  /**
   * PUT /api/cart/items/{cartItemId}
   * Cập nhật số lượng 1 item
   * @param {number} cartItemId
   * @param {number} quantity
   */
  updateCartItem: (cartItemId, quantity) =>
    axiosClient.put(`/cart/items/${cartItemId}`, null, {
      params: { quantity },
    }),

  /**
   * DELETE /api/cart/items/{cartItemId}
   * Xóa 1 item khỏi giỏ hàng
   * @param {number} cartItemId
   */
  removeCartItem: (cartItemId) =>
    axiosClient.delete(`/cart/items/${cartItemId}`),

  /**
   * DELETE /api/cart
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: () => axiosClient.delete("/cart"),
};

export default cartService;