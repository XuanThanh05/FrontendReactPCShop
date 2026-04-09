import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LoginPopup from '../../components/layout/LoginPopup';
import { productCatalog } from '../../data/productCatalog';
import './Home.css';
import axiosClient from '../../services/axiosClient'; 

const categories = [
  { name: 'Laptop', icon: '💻' },
  { name: 'Âm thanh, Mic thu âm', icon: '🎧' },
  { name: 'Đồng hồ, Camera', icon: '📷' },
  { name: 'Đồ gia dụng, Làm đẹp', icon: '🧴' },
  { name: 'Phụ kiện', icon: '🔌' },
  { name: 'PC, Màn hình, Máy in', icon: '🖥️' },
  { name: 'Tivi, Điện máy', icon: '📺' },
  { name: 'Thu cũ đổi mới', icon: '♻️' },
  { name: 'Hàng cũ', icon: '🛍️' },
  { name: 'Khuyến mãi', icon: '🔥' },
  { name: 'Tin công nghệ', icon: '📰' },
];

export default function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchProducts = async (page = 0) => {
    try {
      const res = await axiosClient.get(`/products/paged?page=${page}&size=${pageSize}`);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <Header onLoginClick={() => setShowLoginPopup(true)} />
      <div className="home-content">
        <div className="home-grid">
          <aside className="home-sidebar">
            <h3>Danh mục</h3>
            <div className="sidebar-items">
              {categories.map((c) => (
                <button key={c.name} className="sidebar-item"><span>{c.icon}</span> {c.name}</button>
              ))}
            </div>
          </aside>
          <main className="home-main">
            <section className="hero-banner">
              <div className="hero-slider">
                <div className="slider-track">
                  <a href="/" className="hero-image-link"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/mbam5homepae.png" alt="MACBOOK AIR M5" loading="lazy" /></a>
                  <a href="/" className="hero-image-link"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/AsusTufGaminghome.png" alt="ASUS TUF GAMING" loading="lazy" /></a>
                  <a href="/" className="hero-image-link"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/a-17.png" alt="Galaxy A17 5G" loading="lazy" /></a>
                </div>
              </div>
            </section>
            <section className="promo-row">
              <a target="_blank" rel="noreferrer" href="/"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:50/plain/https://dashboard.cellphones.com.vn/storage/macbook-giao-xa-2026.png" alt="Studio Display" /></a>
              <a target="_blank" rel="noreferrer" href="/"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:50/plain/https://dashboard.cellphones.com.vn/storage/RightBanner_PRE_MacBookAirM5.png" alt="MacBook Air M5" /></a>
              <a target="_blank" rel="noreferrer" href="/"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:50/plain/https://dashboard.cellphones.com.vn/storage/a-17.png" alt="Mua laptop online" /></a>
            </section>
            <section className="student-banner"><a href="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:75/q:100/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" target="_blank" rel="noreferrer"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:75/q:100/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" alt="Say Hi" /></a></section>
            <section className="hot-sale">
              <div className="hot-sale-head"><div><h3>🔥 HOT SALE CUỐI TUẦN</h3><p>Ưu đãi sốc, săn ngay</p></div><div className="timer">01 : 02 : 22 : 17</div></div>
              <div className="hot-tabs"><button>Điện thoại, Tablet</button><button>Phụ kiện, PC</button></div>
              <div className="product-grid">
                {products.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="product-img">
                      {p.discount > 0 && (
                        <div className="badge-wrap">
                          <span className="discount-badge">
                            <img src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/discount-badge-ui-2025.png" alt="Giảm" />
                            <span className="badge-text">{p.discount}%</span>
                          </span>
                        </div>
                      )}
                      <img src={p.imageUrl} alt={p.name} />
                    </div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">{p.price.toLocaleString()} đ</div>
                  </Link>
                ))}
              </div>
              <div className="pagination-controls" aria-label="Điều hướng trang sản phẩm">
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  ‹ Trước
                </button>
                <div className="pagination-summary">
                  <span className="pagination-label">Trang</span>
                  <strong>{currentPage + 1}</strong>
                  <span className="pagination-divider">/</span>
                  <span>{totalPages || 1}</span>
                </div>
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => fetchProducts(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Sau ›
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
      <div className="floating-area">
        <button
          type="button"
          className={`back-to-top-btn${showBackToTop ? ' show' : ''}`}
          onClick={handleBackToTop}
          aria-label="Lên đầu trang"
        >
          Lên đầu ︿
        </button>
        <button type="button">Liên hệ</button>
      </div>
      <LoginPopup open={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
      <Footer />
    </div>
  );
}