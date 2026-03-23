describe('Register Tests', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(`${baseUrl}/register`);
  });

  it('Should display register form', () => {
    cy.contains('Thông tin cá nhân').should('be.visible');
    cy.get('input[placeholder="Nhập họ và tên"]').should('be.visible');
    cy.get('input[placeholder="Nhập username"]').should('be.visible');
    cy.get('input[placeholder="Nhập số điện thoại"]').should('be.visible');
    cy.get('input[placeholder="Nhập email"]').should('be.visible');
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]').should('be.visible');
    cy.get('input[placeholder="Nhập lại mật khẩu của bạn"]').should('be.visible');
  });

  it('Should show error when fields are empty', () => {
    cy.get('button').contains('Hoàn tất đăng ký').click();
    cy.contains('Vui lòng nhập').should('be.visible');
  });

  it('Should show error when passwords do not match', () => {
    cy.get('input[placeholder="Nhập họ và tên"]').type('Thanh Tester');
    cy.get('input[placeholder="Nhập username"]').type('thanhtester');
    cy.get('input[placeholder="Nhập số điện thoại"]').type('0123456789');
    cy.get('input[placeholder="Nhập email"]').type('test@example.com');
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]').type('Password123');
    cy.get('input[placeholder="Nhập lại mật khẩu của bạn"]').type('Password456');
    cy.get('button').contains('Hoàn tất đăng ký').click();
    cy.contains('không khớp').should('be.visible');
  });

  it('Should show error for invalid email format', () => {
    cy.get('input[placeholder="Nhập họ và tên"]').type('Thanh Tester');
    cy.get('input[placeholder="Nhập username"]').type('thanhtester');
    cy.get('input[placeholder="Nhập số điện thoại"]').type('0123456789');
    cy.get('input[placeholder="Nhập email"]').type('invalidemail');
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]').type('Password123');
    cy.get('input[placeholder="Nhập lại mật khẩu của bạn"]').type('Password123');
    cy.get('button').contains('Hoàn tất đăng ký').click();
    cy.contains('Email không hợp lệ').should('be.visible');
  });
    it('Should show error if email already exists', () => {
        cy.get('input[placeholder="Nhập họ và tên"]').type('Thanh Tester');
        cy.get('input[placeholder="Nhập username"]').type('thanhtest');
        cy.get('input[placeholder="Nhập số điện thoại"]').type('0987654321');
        cy.get('input[placeholder="Nhập email"]').type('thanh@cellphones.com');
        cy.get('input[placeholder="Nhập mật khẩu của bạn"]').type('Password123!');
        cy.get('input[placeholder="Nhập lại mật khẩu của bạn"]').type('Password123!');
        cy.get('button').contains('Hoàn tất đăng ký').click();
        cy.contains(/Email.*tồn tại|Email đã được sử dụng|Đăng ký thất bại/, { timeout: 5000 }).should('be.visible');
    });

    it('Should successfully register with valid data', () => {
        const timestamp = Date.now();
        const uniqueEmail = `user${timestamp}@test.com`;
        const uniqueUsername = `user${timestamp}`;
    
    cy.get('input[placeholder="Nhập họ và tên"]').type('Thanh Tester');
    cy.get('input[placeholder="Nhập username"]').type(uniqueUsername);
    cy.get('input[placeholder="Nhập số điện thoại"]').type('0987654321');
    cy.get('input[placeholder="Nhập email"]').type(uniqueEmail);
    cy.get('input[placeholder="Nhập mật khẩu của bạn"]').type('Password123!');
    cy.get('input[placeholder="Nhập lại mật khẩu của bạn"]').type('Password123!');
    cy.get('button').contains('Hoàn tất đăng ký').click();
    
    // Chờ redirect về trang chủ
    cy.url({ timeout: 5000 }).should('include', '/');
    
    // Kiểm tra xem trang home hiển thị username (chào người dùng)
    cy.contains(uniqueUsername, { timeout: 5000 }).should('be.visible');
    
    // Kiểm tra localStorage có chứa username đó
    cy.getAllLocalStorage().then((result) => {
      const authCache = JSON.parse(result[baseUrl].pcshop_auth_cache);
      expect(authCache.username).to.equal(uniqueUsername);
    });
  });

  
});
