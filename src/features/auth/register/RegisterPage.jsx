import { Link } from 'react-router-dom';

function Input({ label, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 6, color: '#1f2937', fontSize: 13 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input {...props} style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: '10px 12px', outline: 'none' }} />
    </label>
  );
}

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 760, backgroundColor: '#fff', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: 20 }}>
        <h1 style={{ margin: 0, textAlign: 'center', color: '#d70016', fontSize: '1.9rem' }}>Đăng ký trở thành SMEMBER</h1>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: '50%', backgroundColor: '#fceef0', display: 'grid', placeItems: 'center', fontSize: 24 }}>🐰</div>
          <div style={{ marginTop: 10, color: '#475569', fontSize: 14 }}>Đăng ký bằng tài khoản mạng xã hội</div>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button style={{ borderRadius: 8, padding: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontWeight: 600 }}>Google</button>
          <button style={{ borderRadius: 8, padding: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontWeight: 600 }}>Zalo</button>
        </div>

        <div style={{ marginTop: 12, textAlign: 'center', color: '#475569', fontSize: 13 }}>Hoặc điền thông tin sau</div>

        <div style={{ marginTop: 16, border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Thông tin cá nhân</div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Họ và tên" placeholder="Nhập họ và tên" />
            <Input label="Ngày sinh" placeholder="dd/mm/yyyy" type="date" />
            <Input label="Số điện thoại" placeholder="Nhập số điện thoại" />
            <Input label="Email (Không bắt buộc)" placeholder="Nhập email" type="email" />
          </div>
        </div>

        <div style={{ marginTop: 14, border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tạo mật khẩu</div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" />
            <Input label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu của bạn" type="password" />
          </div>
          <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Mật khẩu tối thiểu 6 ký tự, có ít nhất 1 chữ số và 1 chữ hoa.</div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
          <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}><button style={{ width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#111', fontWeight: 600, padding: '10px 12px' }}>Quay lại đăng nhập</button></Link>
          <button style={{ flex: 1, border: 'none', borderRadius: 8, backgroundColor: '#d8001a', color: '#fff', fontWeight: 700, padding: '10px 12px' }}>Hoàn tất đăng ký</button>
        </div>
      </div>
    </div>
  );
}
