describe('Logout Tests', () => {
  const usernameInput = 'input[placeholder="Nhập username của bạn"]';
  const passwordInput = 'input[placeholder="Nhập mật khẩu của bạn"]';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '**/auth/me', {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('getCurrentSession');

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        customerId: 11,
        username: 'user1',
        fullName: 'User One',
        role: 'CUSTOMER',
      },
    }).as('loginSuccess');

    cy.visit('/login');
    cy.wait('@getCurrentSession');
    cy.get(usernameInput).type('user1');
    cy.get(passwordInput).type('user123');
    cy.get('button').contains('Đăng nhập').click();
    cy.wait('@loginSuccess');
    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);
  });

  it('Should show logout button when logged in', () => {
    cy.contains('Đăng xuất').should('be.visible');
  });

  it('Should logout successfully', () => {
    cy.intercept('POST', '**/auth/logout', {
      statusCode: 200,
      body: {},
    }).as('logoutSuccess');

    cy.contains('Đăng xuất').click();
    cy.wait('@logoutSuccess');

    cy.contains('Đăng nhập').should('be.visible');
    cy.contains('Xin chào').should('not.exist');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('pcshop_auth_cache')).to.be.null;
    });
  });
});
