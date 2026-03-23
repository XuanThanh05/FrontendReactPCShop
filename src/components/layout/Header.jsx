import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import './Header.css';
import axiosClient from '../../services/axiosClient'; 

export default function Header({ onLoginClick }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/products'); // gọi API backend
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  fetchProducts();
}, []);

  useEffect(() => {
    const searchText = new URLSearchParams(location.search).get('q') || '';
    setKeyword(searchText);
  }, [location.pathname, location.search]);

  const suggestions = useMemo(() => {
    // map chỉ lấy tên sản phẩm
    return products.map(p => p.name).slice(0, 10); // giới hạn 100 gợi ý
  }, [products]);

  const filtered = suggestions.filter(item =>
    item.toLowerCase().includes(keyword.toLowerCase())
  );

  const submitSearch = (value) => {
    const normalized = value.trim();
    navigate(normalized ? `/search?q=${encodeURIComponent(normalized)}` : '/search');
    setShowSuggest(false);
  };

  return (
    <header className="pc-header">
      <div className="pc-header-inner">
        <div className="pc-header-brand-wrap">
          <Link to="/" className="pc-header-brand">
            <strong>PCShop</strong>
          </Link>
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, margin: '0 8px', maxWidth: 500 }}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitSearch(keyword);
              }
            }}
            style={{
              width: '100%',
              borderRadius: 10,
              border: 0,
              padding: '10px 12px',
              fontWeight: 600
            }}
            placeholder="Bạn muốn mua gì hôm nay?"
          />

          {showSuggest && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                left: 0,
                width: '100%',
                background: '#f5f5f5', 
                borderRadius: 12,
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div
                style={{
                  fontSize: 14,
                  color: '#333',
                  fontWeight: 600,
                  padding: '10px 12px',
                  background: '#eaeaea'
                }}
              >
                Có phải bạn muốn tìm
              </div>

              {/* List */}
              <div>
                {filtered.map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={() => {
                      setKeyword(item);
                      submitSearch(item);
                    }}
                    style={{
                      padding: '10px 12px',
                      fontSize: 14,
                      color: '#333',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#e6e6e6')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="pc-header-actions">
          <Link to="/cart" className="header-link">🛒 Giỏ hàng</Link>

          {isAdmin ? <Link to="/admin/users" className="header-link">🛠 Quản lý user</Link> : null}

          {currentUser ? (
            <>
              <Link to="/account" className="header-user-label" style={{textDecoration: 'none', cursor: 'pointer'}}>Xin chào, {currentUser.fullName}</Link>
              <button
                type="button"
                className="header-link header-link-button"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="header-link"
              onClick={(e) => {
                if (onLoginClick) {
                  e.preventDefault();
                  onLoginClick();
                }
              }}
            >
              👤 Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
