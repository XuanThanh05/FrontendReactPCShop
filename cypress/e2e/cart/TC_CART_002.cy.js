describe('TC_CART_002: Thêm sản phẩm với số lượng lớn hơn 1', () => {
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

  it('Thêm sản phẩm với số lượng lớn hơn 1', () => {
    cy.visit(`${baseUrl}/`);
    //không phải viết vì không có chức năng này
  });
});
