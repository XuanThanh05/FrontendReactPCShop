import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import axiosClient from '../../services/axiosClient'; // axios đã cấu hình sẵn
import './SearchPage.css';

function toPriceNumber(price) {
  return Number(price); // backend trả price dạng number rồi
}

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = (new URLSearchParams(location.search).get('q') || '').trim();

  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortType, setSortType] = useState('relevance');

  // 1️⃣ Lấy sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  // 2️⃣ Tạo danh sách thương hiệu
  const brands = useMemo(() => {
    const allBrands = products.map(p => p.brand);
    return ['all', ...new Set(allBrands)];
  }, [products]);

  // 3️⃣ Lọc sản phẩm theo query, brand, sort
  const searchedProducts = useMemo(() => {
    const keyword = query.toLowerCase();
    const searched = products.filter((p) => {
      if (!keyword) return true;
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.brand.toLowerCase().includes(keyword) ||
        (p.category || '').toLowerCase().includes(keyword)
      );
    });

    const brandFiltered =
      selectedBrand === 'all'
        ? searched
        : searched.filter((p) => p.brand === selectedBrand);

    if (sortType === 'price-asc') {
      return [...brandFiltered].sort((a, b) => toPriceNumber(a.price) - toPriceNumber(b.price));
    }

    if (sortType === 'price-desc') {
      return [...brandFiltered].sort((a, b) => toPriceNumber(b.price) - toPriceNumber(a.price));
    }

    return brandFiltered;
  }, [products, query, selectedBrand, sortType]);

  const goSearch = (nextKeyword) => {
    const normalized = nextKeyword.trim();
    navigate(normalized ? `/search?q=${encodeURIComponent(normalized)}` : '/search');
  };

  return (
    <div className="search-page">
      <Header />
      <main className="search-main">
        <div className="search-head">
          <h1>
            Kết quả tìm kiếm cho: <span>"{query || 'tất cả sản phẩm'}"</span>
          </h1>
          <p>Tìm thấy {searchedProducts.length} sản phẩm</p>
        </div>

        <section className="search-toolbar">
          <div className="search-toolbar-row">
            <span>Lọc theo hãng:</span>
            {brands.map((brand) => (
              <button
                type="button"
                key={brand}
                className={`search-chip${selectedBrand === brand ? ' active' : ''}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand === 'all' ? 'Tất cả' : brand}
              </button>
            ))}
          </div>

          <div className="search-toolbar-row">
            <span>Sắp xếp:</span>
            <button
              type="button"
              className={`search-chip${sortType === 'relevance' ? ' active' : ''}`}
              onClick={() => setSortType('relevance')}
            >
              Liên quan
            </button>
            <button
              type="button"
              className={`search-chip${sortType === 'price-asc' ? ' active' : ''}`}
              onClick={() => setSortType('price-asc')}
            >
              Giá thấp đến cao
            </button>
            <button
              type="button"
              className={`search-chip${sortType === 'price-desc' ? ' active' : ''}`}
              onClick={() => setSortType('price-desc')}
            >
              Giá cao đến thấp
            </button>
          </div>
        </section>

        {searchedProducts.length > 0 ? (
          <section className="search-grid">
            {searchedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="search-card">
                {product.discount > 0 && <div className="search-card-badge">-{product.discount}%</div>}
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="search-card-brand">{product.brand}</p>
                <div className="search-card-price">{product.price.toLocaleString()} đ</div>
              </Link>
            ))}
          </section>
        ) : (
          <section className="search-empty">
            <h2>Không tìm thấy sản phẩm phù hợp</h2>
            <p>Thử từ khóa ngắn hơn hoặc tên thương hiệu, ví dụ: Samsung, Apple, Laptop.</p>
            <button type="button" onClick={() => goSearch('')}>Xem tất cả sản phẩm</button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}