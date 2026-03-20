import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../auth/useAuth';
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
  const [activeTab, setActiveTab] = useState('all');

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
            <a href="#orders" className="profile-nav-item active">
              <span className="nav-icon">📦</span> Đơn hàng đã mua
            </a>
            <a href="#vouchers" className="profile-nav-item">
              <span className="nav-icon">🎟️</span> Mã giảm giá
            </a>
            <a href="#membership" className="profile-nav-item">
              <span className="nav-icon">👑</span> Hạng thành viên
            </a>
            <a href="#personal-info" className="profile-nav-item">
              <span className="nav-icon">👤</span> Thông tin cá nhân
            </a>
            <a href="#password" className="profile-nav-item">
              <span className="nav-icon">🔒</span> Đổi mật khẩu
            </a>
          </nav>

          <button className="profile-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </aside>

        <main className="profile-content">
          <h2 className="content-title">Đơn hàng đã mua</h2>

          <div className="order-tabs">
            <button
              className={`order-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Chờ xử lý
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Đã xác nhận
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Đang chuyển hàng
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
              onClick={() => setActiveTab('delivered')}
            >
              Đang giao hàng
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'canceled' ? 'active' : ''}`}
              onClick={() => setActiveTab('canceled')}
            >
              Đã hủy
            </button>
            <button
              className={`order-tab-btn ${activeTab === 'success' ? 'active' : ''}`}
              onClick={() => setActiveTab('success')}
            >
              Thành công
            </button>
          </div>

          {/* Danh sách đơn hàng */}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
