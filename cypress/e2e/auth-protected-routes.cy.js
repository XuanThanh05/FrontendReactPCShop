describe('Protected Routes Tests', () => {
  const baseUrl = 'http://localhost:5173';

  it('Should redirect to login when accessing cart without login', () => {
    cy.visit(`${baseUrl}/cart`);
    cy.url().should('include', '/login');
  });

  it('Should redirect to login when accessing checkout without login', () => {
    cy.visit(`${baseUrl}/checkout`);
    cy.url().should('include', '/login');
  });

  it('Should show account page when logged in', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Nhập email hoặc username"]').type('thanh@cellphones.com');
    cy.get('input[placeholder="Nhập mật khẩu"]').type('password123');
    cy.get('button').contains('Đăng nhập').click();
    
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.visit(`${baseUrl}/account`);
    cy.url().should('include', '/account');
  });
});
