describe('Logout Tests', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Login trước
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Nhập email hoặc username"]').type('thanh@cellphones.com');
    cy.get('input[placeholder="Nhập mật khẩu"]').type('password123');
    cy.get('button').contains('Đăng nhập').click();
    cy.url({ timeout: 5000 }).should('include', '/');
  });

  it('Should show logout button when logged in', () => {
    cy.contains('Đăng xuất').should('be.visible');
  });

  it('Should logout successfully', () => {
    cy.contains('Đăng xuất').click();
    // Sau logout, user phải login lại
    cy.contains('Đăng nhập').should('be.visible');
    cy.localStorage('pcshop_auth_cache').should('be.null');
  });
});
