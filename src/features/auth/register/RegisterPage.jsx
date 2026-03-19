import { Link } from 'react-router-dom';

function Input({ label, ...props }) {
  return (
    <label className="auth-input-label">
      <span>{label}</span>
      <input {...props} className="auth-input" />
    </label>
  );
}

export default function RegisterPage() {
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

        <div className="auth-box" style={{ marginTop: 16 }}>
          <div className="auth-box-title">Thông tin cá nhân</div>
          <div className="auth-grid-2" style={{ marginTop: 0 }}>
            <Input label="Họ và tên" placeholder="Nhập họ và tên" />
            <Input label="Ngày sinh" placeholder="dd/mm/yyyy" type="date" />
            <Input label="Số điện thoại" placeholder="Nhập số điện thoại" />
            <Input label="Email (Không bắt buộc)" placeholder="Nhập email" type="email" />
          </div>
          <div className="auth-helper-success">✓ Hóa đơn VAT khi mua hàng sẽ được gửi qua email này</div>
        </div>

        <div className="auth-box">
          <div className="auth-box-title">Tạo mật khẩu</div>
          <div className="auth-grid-2" style={{ marginTop: 0 }}>
            <Input label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" />
            <Input label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu của bạn" type="password" />
          </div>
          <div className="auth-helper-text">Mật khẩu tối thiểu 6 ký tự, có ít nhất 1 chữ số và 1 chữ hoa.</div>

          <label className="auth-check-line">
            <input type="checkbox" />
            <span>Đăng ký nhận tin khuyến mãi từ CellphoneS</span>
          </label>

          <p className="auth-policy-note">
            Bằng việc Đăng ký, bạn đã đọc và đồng ý với <a href="/">Điều khoản sử dụng</a> và{' '}
            <a href="/">Chính sách bảo mật của CellphoneS</a>.
          </p>
        </div>

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
            <button className="auth-ghost-btn">Quay lại trang đăng nhập</button>
          </Link>
          <button className="auth-primary-btn" style={{ flex: 1, marginTop: 0 }}>Hoàn tất đăng ký</button>
        </div>
      </div>
    </div>
  );
}
