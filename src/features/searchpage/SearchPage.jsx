import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { productCatalog } from '../../data/productCatalog';
import './SearchPage.css';

function toPriceNumber(price) {
  return Number(price.replace(/\./g, ''));
}

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = (new URLSearchParams(location.search).get('q') || '').trim();
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortType, setSortType] = useState('relevance');

  const brands = useMemo(() => {
    return ['all', ...new Set(productCatalog.map((item) => item.brand))];
  }, []);

  const searchedProducts = useMemo(() => {
    const keyword = query.toLowerCase();
    const searched = productCatalog.filter((item) => {
      if (!keyword) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
      );
    });

    const brandFiltered =
      selectedBrand === 'all'
        ? searched
        : searched.filter((item) => item.brand === selectedBrand);

    if (sortType === 'price-asc') {
      return [...brandFiltered].sort((a, b) => toPriceNumber(a.price) - toPriceNumber(b.price));
    }

    if (sortType === 'price-desc') {
      return [...brandFiltered].sort((a, b) => toPriceNumber(b.price) - toPriceNumber(a.price));
    }

    return brandFiltered;
  }, [query, selectedBrand, sortType]);

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
            Ket qua tim kiem cho: <span>"{query || 'tat ca san pham'}"</span>
          </h1>
          <p>Tim thay {searchedProducts.length} san pham</p>
        </div>

        <section className="search-toolbar">
          <div className="search-toolbar-row">
            <span>Loc theo hang:</span>
            {brands.map((brand) => (
              <button
                type="button"
                key={brand}
                className={`search-chip${selectedBrand === brand ? ' active' : ''}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand === 'all' ? 'Tat ca' : brand}
              </button>
            ))}
          </div>

          <div className="search-toolbar-row">
            <span>Sap xep:</span>
            <button
              type="button"
              className={`search-chip${sortType === 'relevance' ? ' active' : ''}`}
              onClick={() => setSortType('relevance')}
            >
              Lien quan
            </button>
            <button
              type="button"
              className={`search-chip${sortType === 'price-asc' ? ' active' : ''}`}
              onClick={() => setSortType('price-asc')}
            >
              Gia thap den cao
            </button>
            <button
              type="button"
              className={`search-chip${sortType === 'price-desc' ? ' active' : ''}`}
              onClick={() => setSortType('price-desc')}
            >
              Gia cao den thap
            </button>
          </div>
        </section>

        {searchedProducts.length > 0 ? (
          <section className="search-grid">
            {searchedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="search-card">
                <div className="search-card-badge">-{product.discount}%</div>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="search-card-brand">{product.brand}</p>
                <div className="search-card-price">{product.price} d</div>
              </Link>
            ))}
          </section>
        ) : (
          <section className="search-empty">
            <h2>Khong tim thay san pham phu hop</h2>
            <p>Thu tu khoa ngan hon hoac ten thuong hieu, vi du: Samsung, Apple, Laptop.</p>
            <button type="button" onClick={() => goSearch('')}>Xem tat ca san pham</button>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}