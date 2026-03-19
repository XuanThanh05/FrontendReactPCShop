import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ onLoginClick }) {
  const [keyword, setKeyword] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const navigate = useNavigate();


  const suggestions = [
    'iPhone',
    'iPhone 17 Series',
    'iPhone 16',
    'Dán màn hình điện thoại',
    'Cáp sạc iPhone, Android'
  ];

  const filtered = suggestions.filter(item =>
    item.toLowerCase().includes(keyword.toLowerCase())
  );
  return (
    <header className="pc-header">
      <div className="pc-header-inner">
        <div className="pc-header-brand-wrap">
          <Link to="/" className="pc-header-brand">
            cellphone<strong>S</strong>
          </Link>
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: 220, margin: '0 8px', maxWidth: 500 }}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowSuggest(true)}
            onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && keyword.trim() !== '') {
                navigate(`/search?q=${keyword}`);
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
                    onMouseDown={() => setKeyword(item)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/cart" className="header-link" style={{ color: '#fff', textDecoration: 'none', fontWeight: 400 }}>🛒 Giỏ hàng</Link>
          <Link
            to="/login"
            className="header-link"
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 400 }}
            onClick={(e) => {
              if (onLoginClick) {
                e.preventDefault();
                onLoginClick();
              }
            }}
          >
            👤 Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
