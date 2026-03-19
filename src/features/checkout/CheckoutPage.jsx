import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./CheckoutPage.css";

const DEFAULT_CHECKOUT_ITEMS = [
  {
    id: "mock-1",
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

const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const checkoutState = location.state ?? {};
  const items = checkoutState.items?.length ? checkoutState.items : DEFAULT_CHECKOUT_ITEMS;
  const derivedTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Number.isFinite(checkoutState.total) ? checkoutState.total : derivedTotal;
  const shippingFee = total >= 5000000 ? 0 : 30000;

  const [customer, setCustomer] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const grandTotal = useMemo(() => total + shippingFee, [total, shippingFee]);

  const updateField = (key, value) => {
    setCustomer((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      window.alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="checkout-page checkout-success-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✓</div>
          <h1>Thanh toán thành công</h1>
          <p>
            Đơn hàng mock đã được ghi nhận. Nhân viên sẽ gọi xác nhận với bạn trong 5-10 phút.
          </p>
          <div className="checkout-success-meta">
            <span>Tổng thanh toán: {fmt(grandTotal)}</span>
            <span>Phương thức: {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</span>
          </div>
          <div className="checkout-success-actions">
            <button type="button" onClick={() => navigate("/")}>Về trang chủ</button>
            <button type="button" className="outline" onClick={() => navigate("/cart")}>Mua tiếp</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <button type="button" onClick={() => navigate("/cart")}>← Quay lại giỏ hàng</button>
        <span>Checkout mock</span>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form-card" onSubmit={handleSubmit}>
          <h1>Thông tin giao hàng</h1>

          <label>
            Họ và tên
            <input
              value={customer.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Nhập họ và tên"
            />
          </label>

          <label>
            Số điện thoại
            <input
              value={customer.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </label>

          <label>
            Địa chỉ nhận hàng
            <input
              value={customer.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
            />
          </label>

          <label>
            Ghi chú (tùy chọn)
            <textarea
              value={customer.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Ví dụ: giao giờ hành chính"
              rows={3}
            />
          </label>

          <div className="checkout-payment-methods">
            <h2>Phương thức thanh toán</h2>
            {PAYMENT_METHODS.map((method) => (
              <label key={method.id} className="checkout-radio-row">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="checkout-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý thanh toán..." : "Xác nhận đặt hàng"}
          </button>
        </form>

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
            <span>{shippingFee === 0 ? "Miễn phí" : fmt(shippingFee)}</span>
          </div>
          <div className="checkout-row total">
            <span>Tổng thanh toán</span>
            <strong>{fmt(grandTotal)}</strong>
          </div>

          <p className="checkout-note">Trang thanh toán này sử dụng dữ liệu giả lập để demo luồng đặt hàng.</p>
        </aside>
      </div>
    </div>
  );
}
