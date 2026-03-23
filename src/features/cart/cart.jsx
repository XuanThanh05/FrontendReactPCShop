import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import cartService from "../../services/cartService";
import "./Cart.css";

// ── Icons ─────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30019" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30019" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const SimIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
    <rect x="4" y="4" width="32" height="32" rx="6" fill="#E30019"/>
    <text x="20" y="26" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">SIM</text>
  </svg>
);
const LensIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#222"/>
    <circle cx="20" cy="20" r="10" fill="#444"/>
    <circle cx="20" cy="20" r="5" fill="#666"/>
    <circle cx="16" cy="16" r="2" fill="white" opacity="0.4"/>
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
 
/**
 * Transform CartItemResponse từ BE sang shape dùng trong component.
 * BE trả về: { id, product: { id, name, price, discount, imageUrl }, quantity }
 * discount ở BE là % (ví dụ 10 = 10%) hoặc số tiền — điều chỉnh nếu cần.
 */
const transformItem = (item) => {
  const price = item.productPrice ?? 0;
  const discountPct = item.discount ?? 0;
  const originalPrice = discountPct > 0
    ? Math.round(price / (1 - discountPct / 100))
    : price;
 
  return {
    cartItemId: item.cartItemId,          // id của CartItem (dùng cho update/remove)
    id: item.productId,                   // id sản phẩm (dùng làm key)
    name: item.productName,
    price,
    originalPrice,
    qty: item.quantity,
    stockQuantity: item.stockQuantity ?? 99,
    selected: false,
    image: item.productImageUrl,
    promo: null,
    addons: [],
  };
};
 
// ── Sub-components ────────────────────────────────────────────────────────────
function QtyControl({ qty, onChange }) {
  return (
    <div className="qty-wrap">
      <button className="qty-btn" onClick={() => onChange(Math.max(1, qty - 1))}>−</button>
      <span className="qty-num">{qty}</span>
      <button className="qty-btn" onClick={() => onChange(qty + 1)}>+</button>
    </div>
  );
}
 
 
function CartItemCard({ item, onSelect, onQtyChange, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item__top">
        <input
          type="checkbox"
          className="cart-checkbox"
          checked={item.selected}
          onChange={() => onSelect(item.cartItemId)}
        />
        <img src={item.image} alt={item.name} className="cart-item__img" />
        <div className="cart-item__info">
          <div className="cart-item__name">{item.name}</div>
          <div className="cart-item__price-row">
            <span className="cart-item__price">{fmt(item.price)}</span>
            {item.originalPrice > item.price && (
              <span className="cart-item__original">{fmt(item.originalPrice)}</span>
            )}
          </div>
        </div>
        <div className="cart-item__actions">
          <button className="cart-trash-btn" onClick={() => onRemove(item.cartItemId)}>
            <TrashIcon />
          </button>
          <QtyControl qty={item.qty} onChange={(q) => onQtyChange(item.cartItemId, q)} />
        </div>
      </div>

      {item.promo && (
        <div className="cart-promo-box">
          <GiftIcon />
          <div className="cart-promo-content">
            <div className="cart-promo-title">Khuyến mãi hấp dẫn</div>
            <div className="cart-promo-bullet">
              <span className="cart-promo-dot" />
              <span className="cart-promo-text">{item.promo}</span>
            </div>
          </div>
        </div>
      )}

      <div className="cart-warranty-row">
        <ShieldIcon />
        <span className="cart-warranty-text">Bảo vệ toàn diện với Bảo hành mở rộng</span>
        <button className="cart-warranty-btn">
          <span>chọn gói</span>
          <ChevronRight />
        </button>
      </div>

      {item.addons.length > 0 && (
        <div className="cart-addon-section">
          <div className="cart-addon-header">
            <GiftIcon />
            <span className="cart-addon-header__text">Mua kèm tiết kiệm hơn</span>
          </div>
          {item.addons.map((a) => (
            <AddonRow key={a.id} addon={a} />
          ))}
        </div>
      )}
    </div>
  );
}
 
// ── Main Cart Component ───────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
 
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };
 
  // ── Fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      // BE: CartResponse { cartItems: CartItemResponse[], totalItems, ... }
      const rawItems = res.data?.items?.content ?? [];
      setItems(rawItems.map(transformItem));
    } catch (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchCart(); }, [fetchCart]);
 
  // ── Select ──────────────────────────────────────────────────────────────────
  const toggleSelect = (cartItemId) =>
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, selected: !i.selected } : i))
    );
 
  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setItems((prev) => prev.map((i) => ({ ...i, selected: next })));
  };
 
  // ── Qty (optimistic + sync to BE) ──────────────────────────────────────────
  const [selectAll, setSelectAll] = useState(false);
 
  const changeQty = async (cartItemId, qty) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    if (!item) return;
 
    if (qty > item.stockQuantity) {
      showToast(`Số lượng tối đa là ${item.stockQuantity} (theo tồn kho)`);
      return;
    }
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, qty } : i))
    );
    try {
      await cartService.updateCartItem(cartItemId, qty);
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      // Rollback nếu lỗi
      fetchCart();
    }
  };
 
  // ── Remove single (optimistic) ──────────────────────────────────────────────
  const removeItem = async (cartItemId) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    try {
      await cartService.removeCartItem(cartItemId);
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      fetchCart();
    }
  };
 
  // ── Remove selected (gọi từng item vì BE không có bulk-delete) ─────────────
  const removeSelected = async () => {
    const toDelete = items.filter((i) => i.selected).map((i) => i.cartItemId);
    setItems((prev) => prev.filter((i) => !i.selected));
    setSelectAll(false);
    try {
      await Promise.all(toDelete.map((id) => cartService.removeCartItem(id)));
    } catch (err) {
      console.error("Lỗi xóa nhiều sản phẩm:", err);
      fetchCart();
    }
  };
 
  // ── Derived ─────────────────────────────────────────────────────────────────
  const selectedItems  = items.filter((i) => i.selected);
  const total          = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const saved          = selectedItems.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
  const selectedCount  = selectedItems.reduce((s, i) => s + i.qty, 0);
 
  const goToCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate("/checkout", { state: { items: selectedItems, total, saved, selectedCount } });
  };
 
  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
 
      {toastMsg && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px', background: '#fde8e8', border: '1px solid #E30019', borderRadius: 6, color: '#E30019', position: 'sticky', top: 56, zIndex: 150 }}>
          {toastMsg}
        </div>
      )}
 
      <div className="cart-page" style={{ flex: 1 }}>
        <div className="cart-body">
          <div className="cart-title-row">
            <button className="cart-back-btn" onClick={() => navigate("/")}>
              <ArrowLeftIcon />
            </button>
            <h1 className="cart-page-title">Giỏ hàng của bạn</h1>
          </div>
 
          <div className="cart-layout">
            <div className="cart-left">
              <div className="cart-select-all-bar">
                <label className="cart-select-all-label">
                  <input
                    type="checkbox"
                    className="cart-checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                  <span>Chọn tất cả</span>
                </label>
                <button className="cart-delete-selected-btn" onClick={removeSelected}>
                  Xóa sản phẩm đã chọn
                </button>
              </div>
 
              {loading ? (
                <div className="cart-empty">
                  <div className="cart-empty__text">Đang tải giỏ hàng...</div>
                </div>
              ) : items.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty__icon">🛒</div>
                  <div className="cart-empty__text">Giỏ hàng của bạn đang trống</div>
                  <button className="cart-continue-btn" onClick={() => navigate("/")}>
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    item={item}
                    onSelect={toggleSelect}
                    onQtyChange={changeQty}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>
 
            <div className="cart-right">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">Đơn hàng của bạn</h2>
 
                {selectedItems.length === 0 ? (
                  <p className="cart-summary-empty">Chưa có sản phẩm nào được chọn</p>
                ) : (
                  <>
                    {selectedItems.map((i) => (
                      <div key={i.cartItemId} className="cart-summary-item">
                        <span className="cart-summary-item__name" title={i.name}>
                          {i.name.length > 32 ? i.name.slice(0, 32) + "…" : i.name}
                          <span className="cart-summary-qty-badge">x{i.qty}</span>
                        </span>
                        <span className="cart-summary-item__price">{fmt(i.price * i.qty)}</span>
                      </div>
                    ))}
                    <div className="cart-summary-divider" />
                  </>
                )}
 
                <div className="cart-summary-row">
                  <span>Tạm tính</span>
                  <span className="cart-summary-row__total">{fmt(total)}</span>
                </div>
                {saved > 0 && (
                  <div className="cart-summary-row">
                    <span>Tiết kiệm</span>
                    <span className="cart-summary-row__saved">{fmt(saved)}</span>
                  </div>
                )}
 
                <button
                  className="cart-buy-btn"
                  disabled={selectedCount === 0}
                  onClick={goToCheckout}
                >
                  Mua ngay{selectedCount > 0 ? ` (${selectedCount})` : ""}
                </button>
 
                <div className="cart-trust-row">
                  <div className="cart-trust-badge">🚚 Giao hàng toàn quốc</div>
                  <div className="cart-trust-badge">🔒 Thanh toán bảo mật</div>
                  <div className="cart-trust-badge">↩️ Đổi trả 30 ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {selectedCount > 0 && (
          <div className="cart-sticky-bar">
            <div>
              <div className="cart-sticky-total">
                Tạm tính: <strong>{fmt(total)}</strong>
              </div>
              {saved > 0 && (
                <div className="cart-sticky-save">
                  Tiết kiệm: <span>{fmt(saved)}</span>
                </div>
              )}
            </div>
            <button className="cart-sticky-btn" onClick={goToCheckout}>
              Mua ngay ({selectedCount})
            </button>
          </div>
        )}
      </div>
 
      <Footer />
    </div>
  );
}