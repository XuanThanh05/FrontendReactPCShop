import { Link } from 'react-router-dom';
import './LoginPopup.css';

export default function LoginPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="login-popup-overlay" role="dialog" aria-modal="true" aria-label="Đăng nhập Smember" onClick={onClose}>
      <div className="login-popup-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="login-popup-close" onClick={onClose} aria-label="Đóng popup">
          x
        </button>

        <h3>Smember</h3>
        <div className="login-popup-logo">S</div>
        <p>
          Vui lòng đăng nhập tài khoản Smember để xem ưu đãi và thanh toán dễ dàng hơn.
        </p>

        <div className="login-popup-actions">
          <Link to="/register" className="login-popup-register" onClick={onClose}>
            Đăng ký
          </Link>
          <Link to="/login" className="login-popup-login" onClick={onClose}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
