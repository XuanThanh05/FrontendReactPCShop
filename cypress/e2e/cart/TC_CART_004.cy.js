describe('TC_CART_004: Xem giỏ hàng', () => {
  const baseUrl = 'http://localhost:5173';
  const testUser = {
    email: 'thanh@cellphones.com',
    password: '123456789',
    username: 'thanh'
  };

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Nhập username của bạn"]', { timeout: 8000 }).should('be.visible').type(testUser.username);
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]', { timeout: 8000 }).should('be.visible').type(testUser.password);
    cy.get('button').contains('Đăng nhập', { timeout: 8000 }).should('be.visible').click();
    cy.url({ timeout: 8000 }).should('include', '/');
  });

  it('Xem giỏ hàng', () => {
    
    // Vào giỏ hàng
    cy.visit(`${baseUrl}/cart`);
    
    // Chờ cart page load
    cy.get('.cart-page', { timeout: 8000 }).should('be.visible');
    
    // Kiểm tra hiển thị danh sách sản phẩm
    cy.get('.cart-page-title').should('contain', 'Giỏ hàng của bạn');
    cy.get('.cart-item', { timeout: 8000 }).should('have.length.greaterThan', 0);
    
    // Kiểm tra hiển thị giá và số lượng
    cy.get('.cart-item__price', { timeout: 8000 }).should('be.visible');
    cy.get('.qty-num', { timeout: 8000 }).should('be.visible');
    
    // Kiểm tra tổng tiền
    cy.get('.cart-summary-title').should('contain', 'Đơn hàng của bạn');
  });
});
