import { useLocation } from "react-router-dom";

const products = [
  { name: 'Laptop ASUS Vivobook S14', price: '19.990.000', brand: 'ASUS' },
  { name: 'Laptop ASUS Vivobook 14', price: '17.490.000', brand: 'ASUS' },
  { name: 'MacBook Air M2', price: '29.990.000', brand: 'Apple' },
  { name: 'iPhone 15', price: '24.990.000', brand: 'Apple' },
];

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  // filter sản phẩm
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0' }}>
        {["Bộ lọc", "Hãng sản xuất", "CPU", "RAM", "Giá"].map((item, i) => (
          <button key={i} style={{
            padding: '8px 12px',
            borderRadius: 20,
            border: '1px solid #ddd',
            background: '#f5f5f5',
            cursor: 'pointer'
          }}>
            {item}
          </button>
        ))}
      </div>

      {/* Result */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20
      }}>
        {filtered.map((p, i) => (
          <div key={i} style={{
            border: '1px solid #eee',
            borderRadius: 10,
            padding: 10
          }}>
            <div style={{ height: 150, background: '#f0f0f0', marginBottom: 10 }} />
            <div>{p.name}</div>
            <div style={{ color: 'red', fontWeight: 600 }}>{p.price} đ</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p>Không tìm thấy sản phẩm</p>}
    </div>
  );
}