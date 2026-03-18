import { Link } from 'react-router-dom';

function Input({ label, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 6, fontSize: 14, color: '#1f2937' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input {...props} style={{ width: '100%', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '10px 12px', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} />
    </label>
  );
}

export default function LogInPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'grid', placeItems: 'center', padding: '18px' }}>
      <div style={{ width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 16, padding: '24px 20px', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: '#d70016', fontSize: '1.6rem', textAlign: 'center', margin: '0 0 20px', fontWeight: 700 }}>Đăng nhập SMEMBER</h1>

        <Input label="Số điện thoại" placeholder="Nhập số điện thoại của bạn" type="tel" />
        <Input label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" />

        <button style={{ width: '100%', marginTop: 8, border: 'none', borderRadius: 10, backgroundColor: '#d70016', color: '#fff', fontWeight: 700, padding: '11px 14px', fontSize: 15 }}>Đăng nhập</button>
        <div style={{ textAlign: 'center', marginTop: 10 }}><Link to="/" style={{ textDecoration: 'none', color: '#0b63d4', fontWeight: 600 }}>Quên mật khẩu?</Link></div>

        <div style={{ marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 10, textAlign: 'center', fontSize: 12, color: '#4b5563' }}>Hoặc đăng nhập bằng</div>
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button style={{ borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}>Google</button>
          <button style={{ borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '8px 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600 }}>Zalo</button>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14, color: '#334155' }}>
          Bạn chưa có tài khoản? <Link to="/register" style={{ color: '#d70016', fontWeight: 700 }}>Đăng ký ngay</Link>
        </div>
        <div style={{ marginTop: 6, textAlign: 'center', fontSize: 14, color: '#334155' }}>
          Mua sắm tại <Link to="/" style={{ color: '#d70016', fontWeight: 700 }}>cellphones.com.vn</Link>
        </div>
      </div>
    </div>
  );
}
