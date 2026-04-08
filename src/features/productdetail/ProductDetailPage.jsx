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

  const isOutOfStock = product?.stockQuantity <= 0;

  const handleBuyNow = () => {
    if (!product || isOutOfStock) return;
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

    if (isOutOfStock) {
      setErrorMessage('Sản phẩm hiện đã hết hàng');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setAddingToCart(true);
    try {
      const cartRes = await cartService.getCart();
      const cartItems = cartRes.data?.items?.content ?? [];
      const existing = cartItems.find((i) => i.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty >= product.stockQuantity) {
        setErrorMessage(`Số lượng trong giỏ đã đạt tối đa tồn kho (${product.stockQuantity})`);
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      await cartService.addToCart(parseInt(id), 1);
      setSuccessMessage('Đã thêm sản phẩm vào giỏ hàng');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
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
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '12px 16px',
          background: '#d4edda', border: '1px solid #c3e6cb',
          borderRadius: 6, color: '#155724', position: 'sticky', top: 0, zIndex: 100
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '12px 16px',
          background: '#fde8e8', border: '1px solid #E30019',
          borderRadius: 6, color: '#E30019', position: 'sticky', top: 0, zIndex: 100
        }}>
          {errorMessage}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: '30px auto', padding: '16px' }}>
        <section style={{
          display: 'flex', flexWrap: 'wrap', gap: 20,
          background: '#fff', borderRadius: 10,
          border: '1px solid #e8e8e8', padding: 16
        }}>
          {/* Ảnh sản phẩm */}
          <div style={{ flex: '1 1 500px', minWidth: 320 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{
                gridColumn: '1 / span 2', border: '1px solid #ddd',
                borderRadius: 10, overflow: 'hidden', background: '#f9f9f9'
              }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: 360, objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    width: 80, height: 80, border: '1px solid #ddd',
                    borderRadius: 6, overflow: 'hidden'
                  }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div style={{ flex: '1 1 360px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#666' }}>
              <Link to="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link>
              {' > '}{product.category}{' > '}
              <span style={{ color: '#999' }}>{product.name}</span>
            </div>

            <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ marginBottom: 4, color: isOutOfStock ? '#d70018' : '#999', fontSize: 14, fontWeight: isOutOfStock ? 700 : 400 }}>
              📦 Tình trạng: {isOutOfStock ? 'Hết hàng' : 'Còn hàng'}
            </div>

            <div style={{ fontSize: '2rem', color: '#d70018', fontWeight: 800 }}>
              {product.price.toLocaleString()} đ
            </div>

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

            {/* Nút hành động */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {/* Nút MUA NGAY */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                style={{
                  flex: 1,
                  borderRadius: 7,
                  border: `1px solid ${isOutOfStock ? '#ccc' : '#000'}`,
                  background: isOutOfStock ? '#f0f0f0' : '#fff',
                  color: isOutOfStock ? '#aaa' : '#000',
                  padding: '12px',
                  fontWeight: 700,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.6 : 1,
                }}
              >
                MUA NGAY
              </button>

              {/* Nút THÊM VÀO GIỎ */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                style={{
                  flex: 1,
                  borderRadius: 7,
                  border: `1px solid ${isOutOfStock ? '#ccc' : '#d70018'}`,
                  background: isOutOfStock ? '#ccc' : '#d70018',
                  color: '#fff',
                  padding: '12px',
                  fontWeight: 700,
                  cursor: (addingToCart || isOutOfStock) ? 'not-allowed' : 'pointer',
                  opacity: (addingToCart || isOutOfStock) ? 0.6 : 1,
                }}
              >
                {addingToCart ? 'Đang thêm...' : isOutOfStock ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ'}
              </button>
            </div>

            {/* Bảng thông tin */}
            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: '0 0 8px' }}>Thông tin sản phẩm</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700, width: 130 }}>Tên</td>
                    <td style={{ padding: '8px 4px' }}>{product.name}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Thương hiệu</td>
                    <td style={{ padding: '8px 4px' }}>{product.brand}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Danh mục</td>
                    <td style={{ padding: '8px 4px' }}>{product.category}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Giá</td>
                    <td style={{ padding: '8px 4px' }}>{product.price.toLocaleString()} đ</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Số lượng</td>
                    <td style={{ padding: '8px 4px' }}>{product.stockQuantity}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Giảm giá</td>
                    <td style={{ padding: '8px 4px' }}>{product.discount}%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 4px', fontWeight: 700 }}>Mô tả</td>
                    <td style={{ padding: '8px 4px' }}>{product.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Đánh giá */}
        <section style={{ marginTop: 20, background: '#fff', borderRadius: 10, border: '1px solid #eee', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{'5.0'}<span style={{ fontSize: 16, color: '#666' }}>/5</span></div>
              <div style={{ marginTop: 4, color: '#f5a623' }}>★★★★★</div>
              <div style={{ color: '#666', marginTop: 2 }}>7 lượt đánh giá</div>
            </div>
            <button style={{ background: '#d70018', color: '#fff', border: 0, borderRadius: 6, padding: '10px 14px', fontWeight: 700 }}>
              Viết đánh giá
            </button>
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

        {/* Hỏi đáp */}
        <section style={{ marginTop: 20, background: '#fff', borderRadius: 10, border: '1px solid #eee', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#f00',
              color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700
            }}>S</div>
            <div>
              <div style={{ fontWeight: 700 }}>Hỏi và đáp</div>
              <div style={{ color: '#666', fontSize: 14 }}>Hãy đặt câu hỏi, PCShop trả lời trong 1 giờ.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              placeholder="Viết câu hỏi của bạn tại đây"
              style={{ flex: 1, borderRadius: 6, border: '1px solid #ddd', padding: '10px 12px', outline: 'none' }}
            />
            <button style={{
              borderRadius: 6, border: 0, background: '#d70018',
              color: '#fff', padding: '10px 14px', fontWeight: 700
            }}>Gửi câu hỏi</button>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#3f8b3f',
                color: '#fff', display: 'grid', placeItems: 'center'
              }}>T</div>
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