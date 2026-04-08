import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../auth/useAuth';
import UserOrderStatisticsDashboard from '../../components/UserOrderStatisticsDashboard';
import { getMyOrderHistory } from '../../services/Orderservice';
import UserManagementPage from '../admin/usermanagement/UserManagementPage';
import StatisticsPage from '../admin/statistics/StatisticsPage';
import './UserProfile.css';

export default function UserProfile() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Thêm useLocation

  const [activeTab, setActiveTab] = useState('all');
  // ✅ Đọc state từ navigate, nếu có menu: 'orders' thì mở thẳng tab đó
  const [currentMenu, setCurrentMenu] = useState(location.state?.menu || 'statistics');
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [combinedStatistics, setCombinedStatistics] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const user = currentUser || { fullName: 'Khách hàng' };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await getMyOrderHistory();
        const rawData = Array.isArray(res) ? res : [];

        const groupedOrders = {};
        rawData.forEach(item => {
          if (!groupedOrders[item.orderId]) {
            groupedOrders[item.orderId] = {
              id: item.orderId,
              date: item.createdAt,
              rawStatus: String(item.status || "").toUpperCase(),
              trackingStatus: String(item.trackingStatus || "").toUpperCase(),
              items: [],
              totalAmount: 0
            };
          }
          groupedOrders[item.orderId].items.push(item);
          groupedOrders[item.orderId].totalAmount += Number(item.lineTotal || 0);
        });

        let totalSpentAcc = 0;
        let totalOrdersAcc = 0;
        const statusMap = {};

        const mappedOrders = Object.values(groupedOrders).map(order => {
          const firstItem = order.items[0] || {};
          const extraCount = order.items.length > 1 ? order.items.length - 1 : 0;

          let displayStatus = "Thành công";
          const rawStatus = order.rawStatus;
          const tracking = order.trackingStatus;

          if (tracking === "DELIVERING" || tracking === "PICKING") displayStatus = "Đang giao hàng";
          else if (tracking === "DELIVERED" || tracking === "CONFIRMED") displayStatus = "Thành công";
          else if (rawStatus === "PAID") displayStatus = "Thành công";
          else if (rawStatus === "PENDING" || rawStatus === "PROCESSING") displayStatus = "Chờ xử lý";
          else if (rawStatus === "CANCELLED") displayStatus = "Đã hủy";

          totalSpentAcc += order.totalAmount;
          totalOrdersAcc++;

          if (!statusMap[displayStatus]) statusMap[displayStatus] = 0;
          statusMap[displayStatus]++;

          return {
            id: order.id,
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount),
            status: displayStatus,
            productName: firstItem.productName || `Đơn hàng #${order.id}`,
            image: firstItem.productImage || "https://via.placeholder.com/150",
            extraCount: extraCount,
            productId: firstItem.productId
          };
        });

        mappedOrders.sort((a, b) => b.id - a.id);
        setPurchaseHistory(mappedOrders);

        const statusStatisticsArray = Object.keys(statusMap).map(statusName => {
          return {
            status: statusName,
            percentage: Math.round((statusMap[statusName] / totalOrdersAcc) * 100)
          };
        });

        setCombinedStatistics({
          totalOrders: totalOrdersAcc,
          totalSpent: totalSpentAcc,
          statusStatistics: statusStatisticsArray
        });
      } catch (error) {
        console.error("Lỗi lấy lịch sử mua hàng:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = purchaseHistory.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'shipping' && order.status === 'Đang giao hàng') return true;
    if (activeTab === 'success' && order.status === 'Thành công') return true;
    return false;
  });

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
              <span className="nav-icon">📊</span> Thống kê tài khoản
            </a>
            <a
              href="#orders"
              className={`profile-nav-item ${currentMenu === 'orders' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentMenu('orders'); }}
            >
              <span className="nav-icon">📦</span> Đơn hàng đã mua
            </a>

            {isAdmin && (
              <>
                <a href="#admin-users" className={`profile-nav-item ${currentMenu === 'admin-users' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('admin-users'); }}>
                  <span className="nav-icon">👥</span> Quản lý user
                </a>
                <a href="#admin-statistics" className={`profile-nav-item ${currentMenu === 'admin-statistics' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentMenu('admin-statistics'); }}>
                  <span className="nav-icon">📉</span> Thống kê báo cáo
                </a>
              </>
            )}
          </nav>

          <button className="profile-logout-btn" onClick={logout}>
            Đăng xuất
          </button>
        </aside>

        <main className="profile-content">
          {currentMenu === 'statistics' && (
            <UserOrderStatisticsDashboard
              statistics={combinedStatistics}
              loading={loadingOrders}
            />
          )}

          {currentMenu === 'orders' && (
            <>
              <h2 className="content-title">Đơn hàng đã mua</h2>

              <div className="order-tabs">
                <button
                  className={`order-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Tất cả
                </button>
                <button
                  className={`order-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Đang giao hàng
                </button>
                <button
                  className={`order-tab-btn ${activeTab === 'success' ? 'active' : ''}`}
                  onClick={() => setActiveTab('success')}
                >
                  Thành công
                </button>
              </div>

              <div className="order-list">
                {loadingOrders ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu đơn hàng...</div>
                ) : filteredOrders.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy đơn hàng nào.</div>
                ) : filteredOrders.map((order) => (
                  <div key={order.id} className={`order-card ${order.status === 'Chờ xử lý' ? 'highlight' : ''}`}>
                    <div className="order-status-right">
                      Trạng thái:
                      <span style={{
                        color: order.status === 'Thành công' ? '#2ecc71'
                          : order.status === 'Chờ xử lý' ? '#f39c12'
                            : order.status === 'Đã hủy' ? '#e74c3c'
                              : '#3498db',
                        fontWeight: 'bold', marginLeft: 6
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-details">
                      <div className="order-image" style={{ position: 'relative' }}>
                        <img src={order.image} alt={order.productName} />
                      </div>
                      <div className="order-info-center">
                        <h4 className="order-product-name" style={{ marginBottom: 8 }}>{order.productName}</h4>
                        {order.extraCount > 0 && (
                          <span style={{ fontSize: '0.85rem', color: '#7f8c8d', fontStyle: 'italic' }}>
                            + {order.extraCount} sản phẩm khác
                          </span>
                        )}
                      </div>
                      <div className="order-price-right">
                        <p className="order-price">{order.price}</p>
                        <button
                          className="view-detail-btn"
                          onClick={() => order.productId && navigate(`/product/${order.productId}`)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

              {currentMenu === 'admin-users' && (
                <UserManagementPage />
              )}

              {currentMenu === 'admin-statistics' && (
                <StatisticsPage />
              )}

              {currentMenu !== 'statistics' && currentMenu !== 'orders' && currentMenu !== 'admin-users' && currentMenu !== 'admin-statistics' && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
                  <h2>Tính năng đang phát triển</h2>
                  <p>Vui lòng chọn tính năng khả dụng ở thanh công cụ bên trái.</p>
                </div>
              )}
            </main>
      </div>
      <Footer />
    </div>
  );
}