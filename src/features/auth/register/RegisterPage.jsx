import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AuthBase.css';
import './RegisterPage.css';
import { useAuth } from '../useAuth';

function Input({ label, error, ...props }) {
  return (
    <label className="auth-input-label">
      <span>{label}</span>
      <input {...props} className={`auth-input ${error ? 'auth-input-error' : ''}`} />
      {error ? <small className="auth-field-error">{error}</small> : null}
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
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!currentUser) return;
    navigate('/', { replace: true });
  }, [currentUser, navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    if (errorMessage) setErrorMessage('');
  };

  const mapRegisterErrorMessage = (error) => {
    const rawMessage = error?.message || '';
    const message = rawMessage.toLowerCase();

    if (message.includes('phone') && (message.includes('exists') || message.includes('duplicate'))) {
      return 'Số điện thoại đã được sử dụng. Vui lòng dùng số khác.';
    }
    if (message.includes('email') && (message.includes('exists') || message.includes('duplicate'))) {
      return 'Email đã được sử dụng. Vui lòng dùng email khác.';
    }
    if (message.includes('username') && (message.includes('exists') || message.includes('duplicate'))) {
      return 'Username đã tồn tại. Vui lòng chọn username khác.';
    }

    if (message.includes('email is invalid')) {
      return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
    }
    if (message.includes('phone number format is invalid')) {
      return 'Số điện thoại không đúng định dạng (8-20 ký tự số).';
    }
    if (message.includes('password must be between')) {
      return 'Mật khẩu phải có từ 8 đến 64 ký tự.';
    }
    if (message.includes('username must be between')) {
      return 'Username phải có từ 4 đến 50 ký tự.';
    }

    return rawMessage || 'Đăng ký thất bại. Vui lòng thử lại.';
  };

  const mapRegisterErrorField = (message) => {
    const normalized = String(message || '').toLowerCase();
    if (normalized.includes('username')) return 'username';
    if (normalized.includes('phone') || normalized.includes('số điện thoại')) return 'phone';
    if (normalized.includes('email')) return 'email';
    if (normalized.includes('confirm') || normalized.includes('xác nhận')) return 'confirmPassword';
    if (normalized.includes('password') || normalized.includes('mật khẩu')) return 'password';
    if (normalized.includes('full name') || normalized.includes('họ tên')) return 'fullName';
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    const nextErrors = {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!form.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên.';
    if (!form.username.trim()) nextErrors.username = 'Vui lòng nhập username.';
    if (form.username.trim() && form.username.trim().length < 4) {
      nextErrors.username = 'Username phải có ít nhất 4 ký tự.';
    }
    if (!form.phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại.';
    if (form.phone.trim() && form.phone.trim().length < 8) {
      nextErrors.phone = 'Số điện thoại không hợp lệ.';
    }
    if (!form.email.trim()) nextErrors.email = 'Vui lòng nhập email.';
    if (!form.password.trim()) nextErrors.password = 'Vui lòng nhập mật khẩu.';
    if (!form.confirmPassword.trim()) nextErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.trim() && !emailRegex.test(form.email)) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const registerResult = await register({
        fullName: form.fullName,
        username: form.username,
        password: form.password,
        email: form.email,
        phone: form.phone,
      });

      navigate('/verify-email', {
        state: {
          email: registerResult?.email || form.email.trim(),
        },
      });
    } catch (error) {
      const mappedMessage = mapRegisterErrorMessage(error);
      const mappedField = mapRegisterErrorField(mappedMessage);
      if (mappedField) {
        setFieldErrors((prev) => ({ ...prev, [mappedField]: mappedMessage }));
      } else {
        setErrorMessage(mappedMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-shell register-shell auth-enter-up">
        <h1 className="auth-title">Đăng ký trở thành PCMEMBER</h1>
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
                error={fieldErrors.fullName}
              />
              <Input
                label="Username"
                placeholder="Nhập username"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
                error={fieldErrors.username}
              />
              <Input
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                error={fieldErrors.phone}
              />
              <Input
                label="Email"
                placeholder="Nhập email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                error={fieldErrors.email}
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
                error={fieldErrors.password}
              />
              <Input
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu của bạn"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                error={fieldErrors.confirmPassword}
              />
            </div>
            <div className="auth-helper-text">Mật khẩu tối thiểu 8 ký tự.</div>

            <label className="auth-check-line">
              <input type="checkbox" />
              <span>Đăng ký nhận tin khuyến mãi từ PCShop</span>
            </label>

            <p className="auth-policy-note">
              Bằng việc Đăng ký, bạn đã đọc và đồng ý với <a href="/">Điều khoản sử dụng</a> và{' '}
              <a href="/">Chính sách bảo mật của PCShop</a>.
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
