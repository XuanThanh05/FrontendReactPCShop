export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-col">
            <h4>Tổng đài hỗ trợ miễn phí</h4>
            <p>Mua hàng - bảo hành <strong>1800.2097</strong> (7h30 - 22h00)</p>
            <p>Khiếu nại <strong>1800.2063</strong> (8h00 - 21h30)</p>
          </div>
          <div className="footer-col">
            <h4>Thông tin chính sách</h4>
            <ul>
              <li><a href="#">Mua hàng Online</a></li>
              <li><a href="#">Chính sách giao hàng</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Tra cứu hóa đơn</a></li>
              <li><a href="#">VAT Refund</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Dịch vụ & thông tin</h4>
            <ul>
              <li><a href="#">Khách hàng doanh nghiệp</a></li>
              <li><a href="#">Ưu đãi thanh toán</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Dịch vụ bảo hành mở rộng</a></li>
              <li><a href="#">Hệ thống bảo hành</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Kết nối với CellphoneS</h4>
            <div className="social-icons">Youtube Facebook Instagram TikTok Zalo</div>
            <h4>Website thành viên</h4>
            <div className="member-links">dienthoaivui • careS • Sforum</div>
          </div>
          <div className="footer-col newsletter">
            <h4>Đăng ký nhận tin khuyến mãi</h4>
            <p>Nhận ngay voucher 10%</p>
            <input placeholder="Nhập email của bạn" type="email" />
            <input placeholder="Nhập số điện thoại" type="tel" />
            <button>Đăng ký ngay</button>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} PC Shop - Website phân phối laptop/PC chính hãng.</div>
      </div>
    </footer>
  );
}
