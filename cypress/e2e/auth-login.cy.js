describe('Login Tests', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`);
  });

  it('Should display login form', () => {
    cy.contains('Đăng nhập').should('be.visible');
    cy.get('input[placeholder="Nhập email hoặc username"]').should('be.visible');
    cy.get('input[placeholder="Nhập mật khẩu"]').should('be.visible');
    cy.get('button').contains('Đăng nhập').should('be.visible');
  });

  it('Should show error when fields are empty', () => {
    cy.get('button').contains('Đăng nhập').click();
    cy.contains('Vui lòng nhập').should('be.visible');
  });

  it('Should show error with invalid email', () => {
    cy.get('input[placeholder="Nhập email hoặc username"]').type('invalidemail');
    cy.get('input[placeholder="Nhập mật khẩu"]').type('anypassword');
    cy.get('button').contains('Đăng nhập').click();
    cy.contains('không hợp lệ', { timeout: 5000 }).should('be.visible');
  });

  it('Should show error with wrong credentials', () => {
    cy.get('input[placeholder="Nhập email hoặc username"]').type('wrong@example.com');
    cy.get('input[placeholder="Nhập mật khẩu"]').type('wrongpassword');
    cy.get('button').contains('Đăng nhập').click();
    cy.contains('sai', { timeout: 5000 }).should('be.visible');
  });

  it('Should successfully login with valid credentials', () => {
    cy.get('input[placeholder="Nhập email hoặc username"]').type('thanh@cellphones.com');
    cy.get('input[placeholder="Nhập mật khẩu"]').type('password123');
    cy.get('button').contains('Đăng nhập').click();
    
    // Chờ redirect tới home page
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.contains('Xin chào').should('be.visible');
  });

  it('Should show "Register" link', () => {
    cy.contains('Chưa có tài khoản?').should('be.visible');
    cy.contains('Đăng ký ngay').should('be.visible').should('have.attr', 'href', '/register');
  });

  it('Should navigate to register page when clicking register link', () => {
    cy.contains('Đăng ký ngay').click();
    cy.url().should('include', '/register');
    cy.contains('Đăng ký').should('be.visible');
  });
});
