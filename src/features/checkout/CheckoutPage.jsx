import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "./CheckoutPage.css";

const DEFAULT_CHECKOUT_ITEMS = [
  {
    id: "mock-1",
    name: "Tecno Pova 7 8GB 128GB-Nau",
    price: 4490000,
    qty: 1,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-pova-7_8_.png",
  },
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toan khi nhan hang (COD)" },
  { id: "bank", label: "Chuyen khoan ngan hang" },
  { id: "card", label: "The ATM / Visa / MasterCard" },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "d";

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
      window.alert("Vui long nhap day du ho ten, so dien thoai va dia chi nhan hang.");
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
          <h1>Thanh toan thanh cong</h1>
          <p>
            Don hang mock da duoc ghi nhan. Nhan vien se goi xac nhan voi ban trong 5-10 phut.
          </p>
          <div className="checkout-success-meta">
            <span>Tong thanh toan: {fmt(grandTotal)}</span>
            <span>Phuong thuc: {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</span>
          </div>
          <div className="checkout-success-actions">
            <button type="button" onClick={() => navigate("/")}>Ve trang chu</button>
            <button type="button" className="outline" onClick={() => navigate("/cart")}>Mua tiep</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <button type="button" onClick={() => navigate("/cart")}>← Quay lai gio hang</button>
        <span>Checkout mock</span>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form-card" onSubmit={handleSubmit}>
          <h1>Thong tin giao hang</h1>

          <label>
            Ho va ten
            <input
              value={customer.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Nhap ho va ten"
            />
          </label>

          <label>
            So dien thoai
            <input
              value={customer.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Nhap so dien thoai"
            />
          </label>

          <label>
            Dia chi nhan hang
            <input
              value={customer.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="So nha, duong, quan/huyen, tinh/thanh"
            />
          </label>

          <label>
            Ghi chu (tuy chon)
            <textarea
              value={customer.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Vi du: giao gio hanh chinh"
              rows={3}
            />
          </label>

          <div className="checkout-payment-methods">
            <h2>Phuong thuc thanh toan</h2>
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
            {isSubmitting ? "Dang xu ly thanh toan..." : "Xac nhan dat hang"}
          </button>
        </form>

        <aside className="checkout-summary-card">
          <h2>Don hang cua ban</h2>

          <div className="checkout-item-list">
            {items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="checkout-item-name">{item.name}</p>
                  <span>So luong: {item.qty}</span>
                </div>
                <strong>{fmt(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-row">
            <span>Tam tinh</span>
            <span>{fmt(total)}</span>
          </div>
          <div className="checkout-row">
            <span>Phi van chuyen</span>
            <span>{shippingFee === 0 ? "Mien phi" : fmt(shippingFee)}</span>
          </div>
          <div className="checkout-row total">
            <span>Tong thanh toan</span>
            <strong>{fmt(grandTotal)}</strong>
          </div>

          <p className="checkout-note">Trang thanh toan nay su dung du lieu gia lap de demo luong dat hang.</p>
        </aside>
      </div>
    </div>
  );
}
