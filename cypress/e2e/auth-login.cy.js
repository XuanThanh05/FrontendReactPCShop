describe('Login Tests', () => {
  const usernameInput = 'input[placeholder="Nhập username của bạn"]';
  const passwordInput = 'input[placeholder="Nhập mật khẩu của bạn"]';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept('GET', '**/auth/me', {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('getCurrentSession');

    cy.visit('/login');
    cy.wait('@getCurrentSession');
  });

  it('Should display login form', () => {
    cy.contains('Đăng nhập PCMEMBER').should('be.visible');
    cy.get(usernameInput).should('be.visible');
    cy.get(passwordInput).should('be.visible');
    cy.get('button').contains('Đăng nhập').should('be.visible');
  });

  it('Should show error when fields are empty', () => {
    cy.get('button').contains('Đăng nhập').click();
    cy.contains('Vui lòng nhập đầy đủ username và mật khẩu.').should('be.visible');
  });

  it('Should show error with wrong credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Sai thông tin đăng nhập.' },
    }).as('loginFailed');

    cy.get(usernameInput).type('wrong_user');
    cy.get(passwordInput).type('wrongpassword');
    cy.get('button').contains('Đăng nhập').click();
    cy.wait('@loginFailed');
    cy.contains('Sai thông tin đăng nhập.').should('be.visible');
  });

  it('Should successfully login with valid credentials', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        customerId: 11,
        username: 'user1',
        fullName: 'User One',
        role: 'CUSTOMER',
      },
    }).as('loginSuccess');

    cy.get(usernameInput).type('user1');
    cy.get(passwordInput).type('user123');
    cy.get('button').contains('Đăng nhập').click();
    cy.wait('@loginSuccess');

    cy.url({ timeout: 10000 }).should('eq', `${Cypress.config('baseUrl')}/`);
    cy.contains('Xin chào, User One', { timeout: 10000 }).should('be.visible');

    cy.window().then((win) => {
      const authCache = win.localStorage.getItem('pcshop_auth_cache');
      expect(authCache).to.not.be.null;

      const parsed = JSON.parse(authCache);
      expect(parsed.username).to.eq('user1');
      expect(parsed.fullName).to.eq('User One');
    });
  });

  it('Should show "Register" link', () => {
    cy.contains('Bạn chưa có tài khoản?').should('be.visible');
    cy.contains('Đăng ký ngay').should('be.visible').should('have.attr', 'href', '/register');
  });

  it('Should navigate to register page when clicking register link', () => {
    cy.contains('Đăng ký ngay').click();
    cy.url().should('include', '/register');
    cy.contains('Đăng ký').should('be.visible');
  });
});
