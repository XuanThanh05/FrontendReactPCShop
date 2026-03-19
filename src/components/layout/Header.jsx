import { Link } from 'react-router-dom';

export default function Header({ onLoginClick }) {
  return (
    <header className="pc-header">
      <div className="pc-header-inner">
        <div className="pc-header-brand-wrap">
          <Link to="/" className="pc-header-brand">
            cellphone<strong>S</strong>
          </Link>
        </div>
        <div className="pc-header-search-wrap">
          <input
            className="pc-header-search"
            placeholder="Bạn muốn mua gì hôm nay?"
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
        <div className="pc-header-actions">
          <Link to="/cart" className="header-link">🛒 Giỏ hàng</Link>
          {onLoginClick ? (
            <button type="button" className="header-link header-link-button" onClick={onLoginClick}>
              👤 Đăng nhập
            </button>
          ) : (
            <Link to="/login" className="header-link">👤 Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}
