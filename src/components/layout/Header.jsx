import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ backgroundColor: '#d70018', color: '#fff', padding: '8px 0' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 800, letterSpacing: 1.2, fontSize: 20 }}>cellphone<strong>S</strong></Link>
        </div>
        <div style={{ flex: 1, minWidth: 220, margin: '0 8px', maxWidth: 500 }}>
          <input style={{ width: '100%', borderRadius: 10, border: 0, padding: '10px 12px', fontWeight: 600 }} placeholder="Bạn muốn mua gì hôm nay?" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/cart" className="header-link" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>🛒 Giỏ hàng</Link>
          <Link to="/login" className="header-link" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>👤 Đăng nhập</Link>
        </div>
      </div>
    </header>
  );
}
