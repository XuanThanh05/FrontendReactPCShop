import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import LoginPopup from '../../components/layout/LoginPopup';
import './Home.css';

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

const products = [
  { name: 'Galaxy Tab A8', price: '6.890.000', discount: 4, tag: 'Trả góp 0%', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'MacBook Air M2', price: '29.990.000', discount: 5, tag: 'Hot', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'iPhone 15', price: '24.990.000', discount: 9, tag: 'New', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'Laptop Dell XPS 13', price: '31.990.000', discount: 11, tag: 'Best seller', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'Sony WH-1000XM5', price: '7.990.000', discount: 40, tag: 'Deal', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'Samsung S25', price: '22.990.000', discount: 20, tag: 'Hot', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'LG OLED 55"', price: '27.900.000', discount: 7, tag: 'Sale', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
  { name: 'Máy in HP', price: '2.190.000', discount: 3, tag: 'Office', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg' },
];

export default function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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
              <a target="_blank" rel="noreferrer" href="/"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:50/plain/https://dashboard.cellphones.com.vn/storage/RightBanner-display.png" alt="Galaxy A17 5G" /></a>
              <a target="_blank" rel="noreferrer" href="/"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:50/plain/https://dashboard.cellphones.com.vn/storage/a-17.png" alt="Mua laptop online" /></a>
            </section>
            <section className="student-banner"><a href="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:75/q:100/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" target="_blank" rel="noreferrer"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:75/q:100/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-special-desk.gif" alt="Say Hi" /></a></section>
            <section className="hot-sale">
              <div className="hot-sale-head"><div><h3>🔥 HOT SALE CUỐI TUẦN</h3><p>Ưu đãi sốc, săn ngay</p></div><div className="timer">01 : 02 : 22 : 17</div></div>
              <div className="hot-tabs"><button>Điện thoại, Tablet</button><button>Phụ kiện, PC</button></div>
              <div className="product-grid">
                {products.map((p, i) => (
                  <Link key={p.name} to={`/product/${i}`} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="product-img">
                      <div className="badge-wrap">
                        <span className="discount-badge">
                          <img src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/discount-badge-ui-2025.png" alt="Giảm" />
                          <span className="badge-text">{p.discount}%</span>
                        </span>
                      </div>
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">{p.price} đ</div>
                  </Link>
                ))}
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
