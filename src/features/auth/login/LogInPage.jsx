import { Link } from 'react-router-dom';

function Input({ label, ...props }) {
  return (
    <label className="auth-input-label">
      <span>{label}</span>
      <input {...props} className="auth-input" />
    </label>
  );
}

export default function LogInPage() {
  const benefits = [
    'Chiết khấu đến 5% khi mua sản phẩm tại CellphoneS',
    'Miễn phí giao hàng cho thành viên Smember',
    'Tặng voucher sinh nhật đến 500.000đ',
    'Trợ giá thu cũ lên đến 1 triệu',
    'Đặc quyền ưu đãi thêm đến 10% cho học sinh, sinh viên',
    'S-Business: Ưu đãi riêng cho khách hàng doanh nghiệp',
  ];

  return (
    <div className="auth-page auth-page-login">
      <div className="auth-shell login-shell">
        <section className="login-showcase auth-enter-left">
          <div className="login-brand-row">
            <span>cellphoneS</span>
            <span>dienthoaivui</span>
          </div>
          <h2>
            Nhập hội khách hàng thân thiết <strong>SMEMBER</strong>
          </h2>
          <p>Để không bỏ lỡ các ưu đãi hấp dẫn từ CellphoneS</p>

          <div className="login-benefits-card">
            <ul>
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="/">Xem chi tiết chính sách ưu đãi Smember</a>
          </div>

          <div className="login-showcase-mascot" aria-hidden="true">
            Ưu đãi
          </div>
        </section>

        <section className="auth-card login-form-card auth-enter-right">

          <h1 className="auth-title">Đăng nhập SMEMBER</h1>

          <div className="auth-form-group">
            <Input label="Số điện thoại" placeholder="Nhập số điện thoại của bạn" type="tel" />
            <Input label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" />
          </div>

          <button className="auth-primary-btn">Đăng nhập</button>
          <div className="auth-text-center" style={{ marginTop: 10 }}>
            <Link to="/" className="auth-link">Quên mật khẩu?</Link>
          </div>

          <div className="auth-divider">Hoặc đăng nhập bằng</div>
          <div className="auth-grid-2 auth-social-grid">
            <button className="auth-ghost-btn">Google</button>
            <button className="auth-ghost-btn">Zalo</button>
          </div>

          <div className="auth-text-center" style={{ marginTop: 18, fontSize: 14, color: '#334155' }}>
            Bạn chưa có tài khoản? <Link to="/register" className="auth-link-strong">Đăng ký ngay</Link>
          </div>
          <div className="auth-text-center" style={{ marginTop: 8, fontSize: 14, color: '#334155' }}>
            Mua sắm tại <Link to="/" className="auth-link-strong">cellphones.com.vn</Link> và{' '}
            <Link to="/" className="auth-link-strong">dienthoaivui.com.vn</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
