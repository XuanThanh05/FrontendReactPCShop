import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
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
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ marginRight: 8, flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Tecno Pova 7 8GB 128GB-Nâu",
    price: 4490000,
    originalPrice: 4990000,
    qty: 3,
    selected: true,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-pova-7_8_.png",
    promo: "Giảm thêm 10% cho Loa, Tai nghe, Máy tính bàn, TV (từ 10 triệu) khi mua Điện thoại/Laptop",
    addons: [
      { id: "sim", label: "Mua kèm sim giảm thêm 50K", badge: "Giảm tối đa 50.000đ", icon: "sim" },
      { id: "lens", label: "Mua kèm ống kính camera", badge: "Giảm thêm 5%", icon: "lens" },
    ],
  },
  {
    id: 2,
    name: "Laptop ASUS Vivobook S 14 FLIP TP3402VA-LZ632W-Bạc",
    price: 19000000,
    originalPrice: 22000000,
    qty: 1,
    selected: false,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop_asus_vivobook_s_14_flip_tp3402va-lz632w_-_2.png",
    promo: null,
    addons: [],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
const discount = (item) => item.originalPrice - item.price;

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

function AddonRow({ addon }) {
  const [chosen, setChosen] = useState(false);
  return (
    <div className="cart-addon-row">
      <div className="cart-addon-icon">
        {addon.icon === "sim" ? <SimIcon /> : <LensIcon />}
      </div>
      <div className="cart-addon-info">
        <div className="cart-addon-label">{addon.label}</div>
        <span className="cart-addon-badge">{addon.badge}</span>
      </div>
      <button
        className={`cart-addon-btn${chosen ? " chosen" : ""}`}
        onClick={() => setChosen(!chosen)}
      >
        {chosen ? "Đã chọn" : "Chọn"}
      </button>
    </div>
  );
}

function CartItem({ item, onSelect, onQtyChange, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item__top">
        <input
          type="checkbox"
          className="cart-checkbox"
          checked={item.selected}
          onChange={() => onSelect(item.id)}
        />
        <img src={item.image} alt={item.name} className="cart-item__img" />
        <div className="cart-item__info">
          <div className="cart-item__name">{item.name}</div>
          <div className="cart-item__price-row">
            <span className="cart-item__price">{fmt(item.price)}</span>
            <span className="cart-item__original">{fmt(item.originalPrice)}</span>
          </div>
        </div>
        <div className="cart-item__actions">
          <button className="cart-trash-btn" onClick={() => onRemove(item.id)}>
            <TrashIcon />
          </button>
          <QtyControl qty={item.qty} onChange={(q) => onQtyChange(item.id, q)} />
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
  const { currentUser, isAdmin, logout } = useAuth();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelect = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setItems((prev) => prev.map((i) => ({ ...i, selected: next })));
  };

  const changeQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const removeSelected = () => setItems((prev) => prev.filter((i) => !i.selected));

  const selectedItems = items.filter((i) => i.selected);
  const total = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const saved = selectedItems.reduce((s, i) => s + discount(i) * i.qty, 0);
  const selectedCount = selectedItems.reduce((s, i) => s + i.qty, 0);

  const goToCheckout = () => {
    if (selectedItems.length === 0) return;

    navigate("/checkout", {
      state: {
        items: selectedItems,
        total,
        saved,
        selectedCount,
      },
    });
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="cart-header__inner">
          <span className="cart-header__logo">cellphoneS</span>
          <div className="cart-header__search">
            <SearchIcon />
            <input placeholder="Bạn muốn mua gì hôm nay?" />
          </div>
          <div className="cart-header__actions">
            <button className="cart-header__btn">🛒 Giỏ hàng</button>
            {isAdmin ? (
              <button className="cart-header__btn" onClick={() => navigate("/admin/users")}>
                🛠 Quản lý user
              </button>
            ) : null}
            {currentUser ? (
              <>
                <span className="cart-header__user">👋 {currentUser.fullName}</span>
                <button className="cart-header__btn" onClick={logout}>Đăng xuất</button>
              </>
            ) : (
              <button className="cart-header__btn" onClick={() => navigate("/login")}>👤 Đăng nhập</button>
            )}
          </div>
        </div>
      </header>

      <div className="cart-body">
        <div className="cart-title-row">
          <button className="cart-back-btn" onClick={() => navigate("/")}>
            <ArrowLeftIcon /></button>
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

            {items.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty__icon">🛒</div>
                <div className="cart-empty__text">Giỏ hàng của bạn đang trống</div>
                <button className="cart-continue-btn" onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
              </div>
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.id}
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
                    <div key={i.id} className="cart-summary-item">
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

              <button className="cart-buy-btn" disabled={selectedCount === 0} onClick={goToCheckout}>
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
          <button className="cart-sticky-btn" onClick={goToCheckout}>Mua ngay ({selectedCount})</button>
        </div>
      )}
    </div>
  );
}