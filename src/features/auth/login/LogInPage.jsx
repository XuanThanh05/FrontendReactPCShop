import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AuthBase.css';
import './LogInPage.css';
import { useAuth } from '../useAuth';

function Input({ label, ...props }) {
  return (
    <label className="auth-input-label">
      <span>{label}</span>
      <input {...props} className="auth-input" />
    </label>
  );
}

export default function LogInPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = [
    'Chiết khấu đến 5% khi mua sản phẩm tại CellphoneS',
    'Miễn phí giao hàng cho thành viên Smember',
    'Tặng voucher sinh nhật đến 500.000đ',
    'Trợ giá thu cũ lên đến 1 triệu',
    'Đặc quyền ưu đãi thêm đến 10% cho học sinh, sinh viên',
    'S-Business: Ưu đãi riêng cho khách hàng doanh nghiệp',
  ];

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      setErrorMessage('');
      return;
    }

    setUsername('userdemo');
    setPassword('user123');
    setErrorMessage('');
  };

  useEffect(() => {
    if (!errorMessage) return;

    const timeoutId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (!currentUser) return;
    navigate(currentUser.role === 'admin' ? '/admin/users' : '/', { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ username và mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login({ username, password });
      navigate(user.role === 'admin' ? '/admin/users' : '/');
    } catch (error) {
      setErrorMessage(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page-login">
      {errorMessage ? (
        <div className="login-error-toast" role="alert" aria-live="assertive">
          <span>{errorMessage}</span>
          <button
            type="button"
            className="login-error-toast-close"
            onClick={() => setErrorMessage('')}
            aria-label="Đóng thông báo"
          >
            x
          </button>
        </div>
      ) : null}

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
          <div className="login-account-hint">
            <span>Chọn nhanh tài khoản demo:</span>
            <div className="login-demo-actions">
              <button type="button" className="login-demo-btn" onClick={() => fillDemoCredentials('user')}>
                <strong>User demo</strong>
                <small>userdemo / user123</small>
              </button>
              <button type="button" className="login-demo-btn" onClick={() => fillDemoCredentials('admin')}>
                <strong>Admin demo</strong>
                <small>admin / admin123</small>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <Input
                label="Username"
                placeholder="Nhập username của bạn"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Input
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <button className="auth-primary-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
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
