import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../auth/useAuth';
import UserOrderStatisticsDashboard from '../../components/UserOrderStatisticsDashboard';
import './UserProfile.css';

const mockOrders = [
  {
    id: 'DH001',
    productName: 'Samsung Galaxy S23 Ultra 5G 256GB',
    price: '15.000.000đ',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s23-ultra.png',
    status: 'Đang giao hàng'
  },
  {
    id: 'DH002',
    productName: 'Laptop HP Elitebook 840 G3',
    price: '9.000.000đ',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/h/p/hp-elitebook-840-g3_2_.jpg',
    status: 'Chờ xử lý'
  },
  {
    id: 'DH003',
    productName: 'Galaxy Tab A8',
    price: '6.890.000đ',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tab-a8.png',
    status: 'Thành công'
  }
];

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Nếu navigate từ checkout success với state { menu: "orders" } thì mở thẳng tab đơn hàng
  const initialMenu = location.state?.menu ?? 'statistics';

  const [activeTab, setActiveTab] = useState('all');
  const [currentMenu, setCurrentMenu] = useState(initialMenu);

  const user = currentUser || { fullName: 'Khách hàng, Nguyễn Văn A' };

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-user-info">
            <h3 className="profile-user-name">
              <span>Khách hàng,</span><br />
              <strong>{user.fullName}</strong>
            </h3>
          </div>

          <nav className="profile-nav">
            <a href="#statistics" className={`profile-nav-item ${currentMenu === 'statistics' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('statistics'); }}>
              <span className="nav-icon">📊</span> Thống kê báo cáo
            </a>
            <a href="#orders" className={`profile-nav-item ${currentMenu === 'orders' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('orders'); }}>
              <span className="nav-icon">📦</span> Đơn hàng đã mua
            </a>
            <a href="#vouchers" className={`profile-nav-item ${currentMenu === 'vouchers' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('vouchers'); }}>
              <span className="nav-icon">🎟️</span> Mã giảm giá
            </a>
            <a href="#membership" className={`profile-nav-item ${currentMenu === 'membership' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('membership'); }}>
              <span className="nav-icon">👑</span> Hạng thành viên
            </a>
            <a href="#personal-info" className={`profile-nav-item ${currentMenu === 'personal-info' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('personal-info'); }}>
              <span className="nav-icon">👤</span> Thông tin cá nhân
            </a>
            <a href="#password" className={`profile-nav-item ${currentMenu === 'password' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('password'); }}>
              <span className="nav-icon">🔒</span> Đổi mật khẩu
            </a>
          </nav>

          <button className="profile-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </aside>

        <main className="profile-content">
          {currentMenu === 'statistics' && (
            <UserOrderStatisticsDashboard userId={1} />
          )}

          {currentMenu === 'orders' && (
            <>
              <h2 className="content-title">Đơn hàng đã mua</h2>

              <div className="order-tabs">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'pending', label: 'Chờ xử lý' },
                  { key: 'confirmed', label: 'Đã xác nhận' },
                  { key: 'shipping', label: 'Đang chuyển hàng' },
                  { key: 'delivered', label: 'Đang giao hàng' },
                  { key: 'canceled', label: 'Đã hủy' },
                  { key: 'success', label: 'Thành công' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`order-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="order-list">
                {mockOrders.map((order) => (
                  <div key={order.id} className={`order-card ${order.status === 'Chờ xử lý' ? 'highlight' : ''}`}>
                    <div className="order-status-right">
                      Trạng thái: <span>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <div className="order-image">
                        <img src={order.image} alt={order.productName} />
                      </div>
                      <div className="order-info-center">
                        <h4 className="order-product-name">{order.productName}</h4>
                      </div>
                      <div className="order-price-right">
                        <p className="order-price">{order.price}</p>
                        <button className="view-detail-btn">Xem chi tiết</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentMenu !== 'statistics' && currentMenu !== 'orders' && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
              <h2>Tính năng đang phát triển</h2>
              <p>Vui lòng chọn Thống kê mua sắm hoặc Đơn hàng đã mua.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}