import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const productData = [
  { id: '0', name: 'Galaxy Tab A8', price: '6.890.000', discount: 4, tag: 'Trả góp 0%', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Tablet siêu bền, phù hợp học tập và giải trí.' },
  { id: '1', name: 'MacBook Air M2', price: '29.990.000', discount: 5, tag: 'Hot', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'MacBook nhẹ, mỏng, hiệu năng cao cho công việc và thiết kế.' },
  { id: '2', name: 'iPhone 15', price: '24.990.000', discount: 9, tag: 'New', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Điện thoại mới nhất với camera xịn và pin lâu.' },
  { id: '3', name: 'Laptop Dell XPS 13', price: '31.990.000', discount: 11, tag: 'Best seller', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Laptop mỏng nhẹ, phù hợp dân văn phòng và lập trình.' },
  { id: '4', name: 'Sony WH-1000XM5', price: '7.990.000', discount: 40, tag: 'Deal', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Tai nghe chống ồn đỉnh, âm thanh trong trẻo.' },
  { id: '5', name: 'Samsung S25', price: '22.990.000', discount: 20, tag: 'Hot', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Điện thoại flagship, hiệu năng mượt và camera pro.' },
  { id: '6', name: 'LG OLED 55"', price: '27.900.000', discount: 7, tag: 'Sale', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'TV OLED 55 inch, màu sắc sắc nét, độ tương phản tuyệt vời.' },
  { id: '7', name: 'Máy in HP', price: '2.190.000', discount: 3, tag: 'Office', image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:300/q:100/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s26-ultra-1.jpg', description: 'Máy in nhỏ gọn, thích hợp văn phòng gia đình.' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productData.find((item) => item.id === id);

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
      <main style={{ maxWidth: 1100, margin: '30px auto', padding: '16px' }}>
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: 20, background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: 16 }}>
          <div style={{ flex: '1 1 500px', minWidth: 320 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / span 2', border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden', background: '#f9f9f9' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: 360, objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}><img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 360px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#666' }}><Link to="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 600 }}>Trang chủ</Link> &gt; Laptop &gt; <span style={{ color: '#999' }}>{product.name}</span></div>
            <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ marginBottom: 4, color: '#999', fontSize: 14 }}>📦 Tình trạng: Còn hàng</div>
            <div style={{ fontSize: '2rem', color: '#d70018', fontWeight: 800 }}>{product.price} đ</div>

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
              <button style={{ flex: 1, borderRadius: 7, border: '1px solid #000', background: '#fff', padding: '12px', fontWeight: 700, cursor: 'pointer' }}>MUA NGAY</button>
              <button style={{ flex: 1, borderRadius: 7, border: '1px solid #d70018', background: '#d70018', color: '#fff', padding: '12px', fontWeight: 700, cursor: 'pointer' }}>THÊM VÀO GIỎ</button>
            </div>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ margin: '0 0 8px' }}>Bảng thông số kỹ thuật</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700, width: 130 }}>Brand</td><td style={{ padding: '8px 4px' }}>CellphoneS</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>CPU</td><td style={{ padding: '8px 4px' }}>Intel Core i5</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>RAM</td><td style={{ padding: '8px 4px' }}>8 GB</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>SSD</td><td style={{ padding: '8px 4px' }}>512 GB</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Màn hình</td><td style={{ padding: '8px 4px' }}>15.6" Full HD</td></tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 4px', fontWeight: 700 }}>Hệ điều hành</td><td style={{ padding: '8px 4px' }}>Windows 11</td></tr>
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
              <div style={{ color: '#999', fontSize: 12 }}>Đã mua tại CellphoneS · 1 tuần trước</div>
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
              <div style={{ color: '#666', fontSize: 14 }}>Hãy đặt câu hỏi, CellphoneS trả lời trong 1 giờ.</div>
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
