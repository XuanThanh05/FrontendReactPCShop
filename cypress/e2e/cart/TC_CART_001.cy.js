describe('TC_CART_001: Thêm sản phẩm vào giỏ hàng thành công', () => {
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

  it('Thêm sản phẩm vào giỏ hàng thành công', () => {
    cy.get('a[href*="/product/1"]', { timeout: 8000 }).click();
    
    cy.url({ timeout: 8000 }).should('include', '/product/1');
    
    // Nhấn "THÊM VÀO GIỎ" - chờ button xuất hiện trước khi click
    cy.get('button').contains('THÊM VÀO GIỎ', { timeout: 8000 }).should('be.visible').click();
    
    // Kiểm tra thông báo thành công - chờ div.success-message xuất hiện
    cy.get('div.success-message', { timeout: 10000 }).should('exist').should('contain', 'Đã thêm sản phẩm vào giỏ hàng');
  });
});
