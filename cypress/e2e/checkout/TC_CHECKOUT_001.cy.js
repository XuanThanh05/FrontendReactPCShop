describe('TC_CHECKOUT_001: Mua ngay và thanh toán COD', () => {
  const baseUrl = 'http://localhost:5173';
  const testUser = {
    email: 'thanh@cellphones.com',
    password: '123456789',
    username: 'thanh'
  };

  beforeEach(() => {
    // Đăng nhập
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Nhập username của bạn"]', { timeout: 8000 }).should('be.visible').type(testUser.username);
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]', { timeout: 8000 }).should('be.visible').type(testUser.password);
    cy.get('button').contains('Đăng nhập', { timeout: 8000 }).should('be.visible').click();
    cy.url({ timeout: 8000 }).should('include', '/');
  });

  it('Mua ngay và thanh toán COD thành công', () => {
    // Vào giỏ hàng
    cy.visit(`${baseUrl}/cart`);
    cy.get('.cart-item', { timeout: 8000 }).should('be.visible');
    
    // Tìm ô tích (checkbox) và tích vào
    cy.get('.cart-checkbox').first().click({ timeout: 8000 });
    cy.get('.cart-checkbox').first().should('be.checked');
    
    // Ấn nút "Mua ngay" (cart-buy-btn)
    cy.get('.cart-buy-btn', { timeout: 8000 }).should('be.visible').click();
    
    // Kiểm tra chuyển sang trang checkout
    cy.url({ timeout: 8000 }).should('include', '/checkout');
    
    // Điền thông tin giao hàng
    
    // Số điện thoại
    cy.get('input[placeholder*="Nhập số điện thoại"]', { timeout: 8000 })
      .should('be.visible')
      .type('0912345678');
    
    // Địa chỉ nhận hàng
    cy.get('input[placeholder*="Số nhà"]', { timeout: 8000 })
      .should('be.visible')
      .type('123 Đường A, Quận 1, TP.HCM');
    
    // Ghi chú (tùy chọn)
    cy.get('textarea[placeholder*="Ví dụ"]', { timeout: 8000 })
      .should('be.visible')
      .type('Giao vào buổi chiều');
    
    // Kiểm tra phương thức thanh toán là COD
    cy.contains('Thanh toán khi nhận hàng (COD)', { timeout: 8000 })
      .should('be.visible');
    
    // Ấn nút "Xác nhận đặt hàng"
    cy.get('button').contains('Xác nhận đặt hàng', { timeout: 8000 })
      .should('be.visible')
      .click();
    
    // Kiểm tra hiển thị thông báo thành công
    cy.contains('Thanh toán thành công', { timeout: 10000 }).should('be.visible');
    
    // Kiểm tra thông báo về nhân viên gọi xác nhận
    cy.contains('Đơn hàng mock đã được ghi nhận', { timeout: 8000 }).should('be.visible');
    cy.contains('Nhân viên sẽ gọi xác nhận với bạn trong 5-10 phút', { timeout: 8000 }).should('be.visible');
    
    // Kiểm tra tổng thanh toán
    cy.contains('910.000.000đ', { timeout: 8000 }).should('be.visible');
    
    // Kiểm tra phương thức thanh toán hiển thị
    cy.contains('Thanh toán khi nhận hàng (COD)', { timeout: 8000 }).should('be.visible');
  });
});
