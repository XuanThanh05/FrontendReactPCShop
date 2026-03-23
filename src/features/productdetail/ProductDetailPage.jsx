import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import cartService from '../../services/cartService';
import axiosClient from '../../services/axiosClient';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    
    navigate("/checkout", {
      state: {
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            image: product.imageUrl,
          }
        ],
        total: product.price,
        saved: 0,
        selectedCount: 1,
      }
    });
  };

  const handleAddToCart = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setAddingToCart(true);
    try {
      await cartService.addToCart(parseInt(id), 1);
      setSuccessMessage('Đã thêm sản phẩm vào giỏ hàng');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      // 401 → chưa đăng nhập
      if (err.response?.status === 401) {
        setErrorMessage('Vui lòng đăng nhập trước khi thêm vào giỏ hàng');
      } else {
        setErrorMessage('Có lỗi khi thêm vào giỏ hàng: ' + (err.response?.data?.message || err.message));
      }
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ maxWidth: 1100, margin: '32px auto', padding: '24px', textAlign: 'center' }}>
          <h2>Đang tải...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div style={{ maxWidth: 1100, margin: '32px auto', padding: '24px', textAlign: 'center' }}>
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Xin lỗi, mã sản phẩm không hợp lệ.</p>
          <Link to="/" style={{ color: '#d70018', fontWeight: 700 }}>Về trang chủ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {successMessage && (
        <div className="success-message" style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 6, color: '#155724', position: 'sticky', top: 0, zIndex: 100 }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message" style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 6, color: '#721c24', position: 'sticky', top: 0, zIndex: 100 }}>
          {errorMessage}
        </div>
      )}
      
      <main style={{ maxWidth: 1100, margin: '30px auto', padding: '16px' }}>
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: 20, background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: 16 }}>
          <div style={{ flex: '1 1 500px', minWidth: 320 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / span 2', border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden', background: '#f9f9f9' }}>
                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 360, objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 360px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#666' }}><Link to="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link> &gt; {product.category} &gt; <span style={{ color: '#999' }}>{product.name}</span></div>
            <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ marginBottom: 4, color: '#999', fontSize: 14 }}>📦 Tình trạng: {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}</div>
            <div style={{ fontSize: '2rem', color: '#d70018', fontWeight: 800 }}>{product.price.toLocaleString()} đ</div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Chọn phiên bản:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button style={{ border: '1px solid #ddd', padding: '8px 12px', borderRadius: 6, background: '#fff' }}>Đen</button>
                <button style={{ border: '1px solid #ddd', padding: '8px 12px', borderRadius: 6, background: '#fff' }}>Bạc</button>
                <button style={{ border: '1px solid #ddd', padding: '8px 12px', borderRadius: 6, background: '#fff' }}>Xanh</button>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Dung lượng:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>256 GB</button>
                <button style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px', background: '#fff' }}>512 GB</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button 
                onClick={handleBuyNow}
                style={{ flex: 1, borderRadius: 7, border: '1px solid #000', background: '#fff', padding: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                MUA NGAY
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{ flex: 1, borderRadius: 7, border: '1px solid #d70018', background: '#d70018', color: '#fff', padding: '12px', fontWeight: 700, cursor: addingToCart ? 'not-allowed' : 'pointer', opacity: addingToCart ? 0.7 : 1 }}
              >
                {addingToCart ? 'Đang thêm...' : 'THÊM VÀO GIỎ'}
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: '0 0 8px' }}>Thông tin sản phẩm</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700, width: 130 }}>Tên</td><td style={{ padding: '8px 4px' }}>{product.name}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Thương hiệu</td><td style={{ padding: '8px 4px' }}>{product.brand}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Danh mục</td><td style={{ padding: '8px 4px' }}>{product.category}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Giá</td><td style={{ padding: '8px 4px' }}>{product.price.toLocaleString()} đ</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Số lượng</td><td style={{ padding: '8px 4px' }}>{product.stockQuantity}</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Giảm giá</td><td style={{ padding: '8px 4px' }}>{product.discount}%</td></tr>
                  <tr><td style={{ padding: '8px 4px', fontWeight: 700 }}>Mô tả</td><td style={{ padding: '8px 4px' }}>{product.description}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 20, background: '#fff', borderRadius: 10, border: '1px solid #eee', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{'5.0'}<span style={{ fontSize: 16, color: '#666' }}>/5</span></div>
              <div style={{ marginTop: 4, color: '#f5a623' }}>★★★★★</div>
              <div style={{ color: '#666', marginTop: 2 }}>7 lượt đánh giá</div>
            </div>
            <button style={{ background: '#d70018', color: '#fff', border: 0, borderRadius: 6, padding: '10px 14px', fontWeight: 700 }}>Viết đánh giá</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Đánh giá theo trải nghiệm</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Hiệu năng</span><span style={{ color: '#f5a623' }}>★★★★★</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Thời lượng pin</span><span style={{ color: '#f5a623' }}>★★★★★</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Chất lượng camera</span><span style={{ color: '#f5a623' }}>★★★★★</span></div>
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Lọc đánh giá theo</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Tất cả</span>
                <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Có hình ảnh</span>
                <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>Đã mua hàng</span>
                <span style={{ border: '1px solid #ddd', borderRadius: 999, padding: '4px 10px' }}>5 sao</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ marginBottom: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
              <div style={{ fontWeight: 700 }}>Trần Quốc Minh</div>
              <div style={{ color: '#f5a623' }}>★★★★★</div>
              <p style={{ margin: '4px 0' }}>Hiệu năng siêu mạnh mẽ, pin trâu, camera chụp đẹp.</p>
              <div style={{ color: '#999', fontSize: 12 }}>Đã mua tại PCShop · 1 tuần trước</div>
            </div>
            <div style={{ marginBottom: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
              <div style={{ fontWeight: 700 }}>An Le</div>
              <div style={{ color: '#f5a623' }}>★★★★★</div>
              <p style={{ margin: '4px 0' }}>Này hết giảm giá rồi shop. Chừng nào có tiếp?</p>
              <div style={{ color: '#999', fontSize: 12 }}>1 ngày trước</div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 20, background: '#fff', borderRadius: 10, border: '1px solid #eee', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f00', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>S</div>
            <div>
              <div style={{ fontWeight: 700 }}>Hỏi và đáp</div>
              <div style={{ color: '#666', fontSize: 14 }}>Hãy đặt câu hỏi, PCShop trả lời trong 1 giờ.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input placeholder="Viết câu hỏi của bạn tại đây" style={{ flex: 1, borderRadius: 6, border: '1px solid #ddd', padding: '10px 12px', outline: 'none' }} />
            <button style={{ borderRadius: 6, border: 0, background: '#d70018', color: '#fff', padding: '10px 14px', fontWeight: 700 }}>Gửi câu hỏi</button>
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3f8b3f', color: '#fff', display: 'grid', placeItems: 'center' }}>T</div>
              <div style={{ fontWeight: 700 }}>Tam Tam <span style={{ color: '#999', fontSize: 12 }}>2 tiếng trước</span></div>
            </div>
            <p style={{ margin: '4px 0 8px' }}>Mình đặt hàng rồi, khi nào giao hàng ạ?</p>
            <div style={{ marginLeft: 32, borderLeft: '2px solid #eee', paddingLeft: 10 }}>
              <div style={{ fontWeight: 700, color: '#d70018' }}>Quản Trị Viên</div>
              <p style={{ margin: '4px 0' }}>Chào anh Tam Tam, đơn hàng sẽ giao trong 1-2 ngày.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}