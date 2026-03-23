describe('TC_CART_003: Thêm sản phẩm đã có trong giỏ hàng', () => {
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

  it('Thêm sản phẩm đã có trong giỏ hàng', () => {
    // Lần đầu thêm sản phẩm
    cy.visit(`${baseUrl}/`);
    cy.get('a[href*="/product/1"]', { timeout: 8000 }).click();
    cy.url({ timeout: 8000 }).should('include', '/product/1');
    cy.get('button').contains('THÊM VÀO GIỎ', { timeout: 8000 }).should('be.visible').click();
    cy.get('div.success-message', { timeout: 10000 }).should('exist').should('contain', 'Đã thêm sản phẩm vào giỏ hàng');
    
    // Thêm sản phẩm lần thứ 2 (cùng ID)
    cy.get('button').contains('THÊM VÀO GIỎ', { timeout: 8000 }).should('be.visible').click();
    cy.get('div.success-message', { timeout: 10000 }).should('exist').should('contain', 'Đã thêm sản phẩm vào giỏ hàng');
    
    // Đi tới giỏ hàng
    cy.visit(`${baseUrl}/cart`);
    
    // Chờ cart load xong
    cy.get('.cart-item', { timeout: 8000 }).should('be.visible');
    
  });
});
