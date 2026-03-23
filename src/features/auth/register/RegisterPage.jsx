import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AuthBase.css';
import './RegisterPage.css';
import { useAuth } from '../useAuth';

function Input({ label, ...props }) {
  return (
    <label className="auth-input-label">
      <span>{label}</span>
      <input {...props} className="auth-input" />
    </label>
  );
}

export default function RegisterPage() {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    navigate(currentUser.role === 'admin' ? '/admin/users' : '/', { replace: true });
  }, [currentUser, navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên, username, email và mật khẩu.');
      return;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage('Email không hợp lệ.');
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        fullName: form.fullName,
        username: form.username,
        password: form.password,
        email: form.email,
        phone: form.phone,
      });
      navigate('/');
    } catch (error) {
      let message = error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      
      // Map server error messages to user-friendly messages
      if (message.includes('unauthorized') || message.includes('Unauthorized')) {
        message = 'Email hoặc username đã tồn tại.';
      } else if (message.includes('email') || message.includes('Email')) {
        message = 'Email đã được sử dụng. Vui lòng dùng email khác.';
      } else if (message.includes('username') || message.includes('Username')) {
        message = 'Username đã tồn tại. Vui lòng chọn username khác.';
      }
      
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-shell register-shell auth-enter-up">
        <h1 className="auth-title">Đăng ký trở thành SMEMBER</h1>
        <div className="auth-text-center" style={{ marginTop: 8 }}>
          <div className="register-avatar" aria-hidden="true">SM</div>
          {/* <div className="auth-subtitle" style={{ marginTop: 12 }}>
            Đăng ký bằng tài khoản mạng xã hội
          </div> */}
        </div>

        <div className="auth-grid-2 auth-social-grid" style={{ maxWidth: 460, marginInline: 'auto' }}>
          {/* <button className="auth-ghost-btn">Google</button>
          <button className="auth-ghost-btn">Zalo</button> */}
        </div>

        {/* <div className="auth-subtitle" style={{ marginTop: 12 }}>
          Hoặc điền thông tin sau
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className="auth-box" style={{ marginTop: 16 }}>
            <div className="auth-box-title">Thông tin cá nhân</div>
            <div className="auth-grid-2" style={{ marginTop: 0 }}>
              <Input
                label="Họ và tên"
                placeholder="Nhập họ và tên"
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
              />
              <Input
                label="Username"
                placeholder="Nhập username"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
              />
              <Input
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
              <Input
                label="Email"
                placeholder="Nhập email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </div>
            <div className="auth-helper-success">✓ Hóa đơn VAT khi mua hàng sẽ được gửi qua email này</div>
          </div>

          <div className="auth-box">
            <div className="auth-box-title">Tạo mật khẩu</div>
            <div className="auth-grid-2" style={{ marginTop: 0 }}>
              <Input
                label="Mật khẩu"
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
              <Input
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu của bạn"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
              />
            </div>
            <div className="auth-helper-text">Mật khẩu tối thiểu 8 ký tự.</div>

            <label className="auth-check-line">
              <input type="checkbox" />
              <span>Đăng ký nhận tin khuyến mãi từ CellphoneS</span>
            </label>

            <p className="auth-policy-note">
              Bằng việc Đăng ký, bạn đã đọc và đồng ý với <a href="/">Điều khoản sử dụng</a> và{' '}
              <a href="/">Chính sách bảo mật của CellphoneS</a>.
            </p>
          </div>

          {errorMessage ? (
            <div className="auth-helper-text" style={{ color: '#b91c1c', marginTop: 12 }}>
              {errorMessage}
            </div>
          ) : null}

        {/* <div className="auth-box auth-perk-box"> */}
          {/* <div className="auth-perk-row">
            <div>
              <strong>Tôi là Học sinh - sinh viên / Giáo viên - giảng viên</strong>
              <p>Nhận thêm ưu đãi tối đa 700k/sản phẩm</p>
            </div>
            <button type="button" className="auth-toggle" aria-pressed="false" aria-label="Bật ưu đãi sinh viên" />
          </div> */}

          {/* <div className="auth-perk-row"> */}
            {/* <div>
              <strong>Tôi là Khách hàng Doanh nghiệp</strong>
              <p>Nhận quyền lợi hấp dẫn lên đến 1 triệu/đơn hàng</p>
            </div> *
            <button type="button" className="auth-toggle" aria-pressed="false" aria-label="Bật ưu đãi doanh nghiệp" /> */}
          {/* </div> */}
        {/* </div> */}

          <div className="auth-action-row">
            <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
              <button type="button" className="auth-ghost-btn">Quay lại trang đăng nhập</button>
            </Link>
            <button
              className="auth-primary-btn"
              style={{ flex: 1, marginTop: 0 }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
