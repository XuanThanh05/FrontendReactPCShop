import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createOrder } from "../../services/orderService";
import "./CheckoutPage.css";

const DEFAULT_CHECKOUT_ITEMS = [
  {
    id: 1,
    name: "Tecno Pova 7 8GB 128GB-Nâu",
    price: 4490000,
    qty: 1,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-pova-7_8_.png",
  },
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng (COD)" },
  { id: "bank", label: "Chuyển khoản ngân hàng" },
  { id: "card", label: "Thẻ ATM / Visa / MasterCard" },
];

const DELIVERY_TYPES = [
  { id: "ship", label: "Giao hàng tận nơi" },
  { id: "store", label: "Nhận tại cửa hàng" },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const checkoutState = location.state ?? {};
  const items = checkoutState.items?.length ? checkoutState.items : DEFAULT_CHECKOUT_ITEMS;
  const derivedTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Number.isFinite(checkoutState.total) ? checkoutState.total : derivedTotal;

  const [deliveryType, setDeliveryType] = useState("ship");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [apiError, setApiError] = useState("");

  const [customer, setCustomer] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    address: "",
    note: "",
  });

  const shippingFee = deliveryType === "ship" ? (total >= 5000000 ? 0 : 30000) : 0;
  const grandTotal = useMemo(() => total + shippingFee, [total, shippingFee]);

  const updateField = (key, value) =>
    setCustomer((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      window.alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    // Guard: phải đăng nhập
    if (!currentUser) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    const payload = {
      totalAmount: grandTotal,
      deliveryType,                         // "ship" | "store" → backend dùng để set trackingStatus
      buyerName: customer.fullName,
      buyerPhone: customer.phone,
      address: customer.address,
      latitude: checkoutState.latitude ?? null,
      longitude: checkoutState.longitude ?? null,
      items: items.map((item) => ({
        productId: item.id,                 // integer productId khớp với backend
        quantity: item.qty,
        priceAtPurchase: item.price,
      })),
    };

    setIsSubmitting(true);
    try {
      const data = await createOrder(payload); // axiosClient tự gắn JWT
      setSuccessData(data);
    } catch (err) {
      setApiError(err.message || "Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (successData) {
    return (
      <div className="checkout-page checkout-success-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✓</div>
          <h1>Đặt hàng thành công!</h1>
          <p>Nhân viên sẽ liên hệ xác nhận với bạn trong 5–10 phút.</p>
          <div className="checkout-success-meta">
            <span>Mã đơn hàng: #{successData.orderId}</span>
            <span>Tổng thanh toán: {fmt(successData.totalAmount)}</span>
            <span>Trạng thái: {successData.status}</span>
            <span>
              Phương thức: {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
            </span>
          </div>
          <div className="checkout-success-actions">
            <button type="button" onClick={() => navigate("/")}>
              Về trang chủ
            </button>
            <button
              type="button"
              className="outline"
              onClick={() => navigate("/orders/my-history")}
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main checkout ── */
  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <button type="button" onClick={() => navigate("/cart")}>
          ← Quay lại giỏ hàng
        </button>
        <span>Thanh toán</span>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form-card" onSubmit={handleSubmit}>
          <h1>Thông tin giao hàng</h1>

          {/* Delivery type */}
          <div className="checkout-payment-methods">
            <h2>Hình thức nhận hàng</h2>
            {DELIVERY_TYPES.map((dt) => (
              <label key={dt.id} className="checkout-radio-row">
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === dt.id}
                  onChange={() => setDeliveryType(dt.id)}
                />
                <span>{dt.label}</span>
              </label>
            ))}
          </div>

          <label>
            Họ và tên
            <input
              value={customer.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </label>

          <label>
            Số điện thoại
            <input
              value={customer.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </label>

          <label>
            {deliveryType === "ship" ? "Địa chỉ nhận hàng" : "Chi nhánh / Địa chỉ nhận"}
            <input
              value={customer.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder={
                deliveryType === "ship"
                  ? "Số nhà, đường, quận/huyện, tỉnh/thành"
                  : "Chọn chi nhánh gần nhất"
              }
            />
          </label>

          <label>
            Ghi chú (tùy chọn)
            <textarea
              value={customer.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Ví dụ: giao giờ hành chính"
              rows={3}
            />
          </label>

          {/* Payment method */}
          <div className="checkout-payment-methods">
            <h2>Phương thức thanh toán</h2>
            {PAYMENT_METHODS.map((m) => (
              <label key={m.id} className="checkout-radio-row">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                />
                <span>{m.label}</span>
              </label>
            ))}
          </div>

          {apiError && <div className="checkout-error-banner">{apiError}</div>}

          <button type="submit" className="checkout-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>
        </form>

        {/* Order summary */}
        <aside className="checkout-summary-card">
          <h2>Đơn hàng của bạn</h2>

          <div className="checkout-item-list">
            {items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="checkout-item-name">{item.name}</p>
                  <span>Số lượng: {item.qty}</span>
                </div>
                <strong>{fmt(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-row">
            <span>Tạm tính</span>
            <span>{fmt(total)}</span>
          </div>
          <div className="checkout-row">
            <span>Phí vận chuyển</span>
            <span>
              {deliveryType === "store"
                ? "Không áp dụng"
                : shippingFee === 0
                ? "Miễn phí"
                : fmt(shippingFee)}
            </span>
          </div>
          <div className="checkout-row total">
            <span>Tổng thanh toán</span>
            <strong>{fmt(grandTotal)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}