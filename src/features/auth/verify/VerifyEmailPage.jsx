import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../AuthBase.css';
import './VerifyEmailPage.css';
import { resendEmailOtpApi, verifyEmailOtpApi } from '../../../services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const otpInputRefs = useRef([]);

  const [email, setEmail] = useState(location?.state?.email || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (location?.state?.email && !email) {
      setEmail(location.state.email);
    }
  }, [location?.state?.email, email]);

  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const canResend = useMemo(() => cooldown <= 0 && !isResending, [cooldown, isResending]);
  const otpValue = otpDigits.join('');

  const handleOtpChange = (index, rawValue) => {
    const nextDigit = rawValue.replace(/[^0-9]/g, '').slice(-1);

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = nextDigit;
      return next;
    });

    if (nextDigit && index < otpInputRefs.current.length - 1) {
      window.requestAnimationFrame(() => {
        otpInputRefs.current[index + 1]?.focus();
      });
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedValue) return;

    event.preventDefault();
    const nextDigits = Array.from({ length: 6 }, (_, index) => pastedValue[index] || '');
    setOtpDigits(nextDigits);
    const nextFocusIndex = Math.min(pastedValue.length, 5);
    window.requestAnimationFrame(() => {
      otpInputRefs.current[nextFocusIndex]?.focus();
    });
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập email đã đăng ký.');
      return;
    }

    if (!/^\d{6}$/.test(otpValue)) {
      setErrorMessage('OTP phải gồm đúng 6 chữ số.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await verifyEmailOtpApi({ email, otp: otpValue });
      setSuccessMessage(response?.message || 'Xác minh email thành công.');
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (error) {
      setErrorMessage(error?.message || 'Xác minh email thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập email để gửi lại OTP.');
      return;
    }

    try {
      setIsResending(true);
      const response = await resendEmailOtpApi({ email });
      setSuccessMessage(response?.message || 'Đã gửi lại OTP.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể gửi lại OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-page auth-page">
      <div className="verify-shell auth-enter-up">
        <aside className="verify-hero">
          <div className="verify-badge">PCShop Secure</div>
          <h1>Xác minh email để mở khóa tài khoản</h1>
          <p>
            Mã OTP 6 chữ số đã được gửi đến email của bạn. Nhập mã để hoàn tất xác minh và tiếp tục đăng nhập.
          </p>

          <div className="verify-highlight-card">
            <div className="verify-highlight-label">Email nhận mã</div>
            <div className="verify-highlight-value">{email || 'Chưa có email'}</div>
          </div>

          <ul className="verify-checklist">
            <li>Mã có hiệu lực trong 10 phút</li>
            <li>Có thể gửi lại OTP sau 60 giây</li>
            <li>Không chia sẻ mã với bất kỳ ai</li>
          </ul>
        </aside>

        <section className="verify-card auth-card">
          <div className="verify-card-top">
            <div className="verify-icon">✦</div>
            <div>
              <h2>Xác minh email</h2>
              <p>Nhập 6 số OTP để xác thực tài khoản.</p>
            </div>
          </div>

          {location?.state?.message ? (
            <div className="verify-info-banner">{location.state.message}</div>
          ) : null}

          <form onSubmit={handleVerify} className="verify-form">
            <label className="auth-input-label">
              <span>Email</span>
              <input
                className="auth-input verify-email-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Nhập email đã đăng ký"
                autoComplete="email"
              />
            </label>

            <div className="auth-input-label">
              <span>Mã OTP</span>
              <div className="verify-otp-grid" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    className="verify-otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
              <small className="verify-help-text">Bạn có thể dán nguyên mã OTP vào ô đầu tiên.</small>
            </div>

            {errorMessage ? <div className="verify-alert verify-alert-error">{errorMessage}</div> : null}
            {successMessage ? <div className="verify-alert verify-alert-success">{successMessage}</div> : null}

            <button className="auth-primary-btn verify-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác minh...' : 'Xác minh email'}
            </button>
          </form>

          <div className="verify-actions">
            <button className="auth-ghost-btn verify-resend-btn" type="button" disabled={!canResend} onClick={handleResend}>
              {isResending
                ? 'Đang gửi lại...'
                : cooldown > 0
                ? `Gửi lại OTP sau ${cooldown}s`
                : 'Gửi lại OTP'}
            </button>
            <Link to="/login" className="verify-back-link">
              Quay lại đăng nhập
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
