describe('User Order Statistics Dashboard E2E Tests', () => {

    beforeEach(() => {
        // Giả lập (Mock) API Response cho UserProfile để không phụ thuộc vào data thật
        cy.intercept('GET', '**/api/user/statistics/orders/*', {
            statusCode: 200,
            body: {
                totalOrders: 15,
                totalSpent: 45000000.0, // 45.000.000
                statusStatistics: [
                    { status: 'Thành công', count: 10, percentage: 66.67 },
                    { status: 'Đang giao hàng', count: 3, percentage: 20.00 },
                    { status: 'Đã hủy', count: 2, percentage: 13.33 }
                ]
            }
        }).as('getUserOrderStats');

        // Định tuyến URL trang Profile của User trên Frontend
        // (Thay đổi '/user/profile/statistics' thành path thực tế trong ứng dụng React của bạn)
        cy.visit('/user/profile/statistics'); 
    });

    it('hiển thị đúng các dữ liệu thống kê tổng quan (Tổng đơn, Tổng chi tiêu)', () => {
        // Kiểm tra request đã được mock thành công chưa
        cy.wait('@getUserOrderStats').its('response.statusCode').should('eq', 200);

        // Kiểm tra giao diện render đúng tiêu đề
        cy.contains('Thống kê Hành trình Mua sắm').should('be.visible');

        // Kiểm tra block "Tổng số Đơn hàng"
        cy.contains('Tổng số Đơn hàng').should('be.visible');
        cy.get('.total-orders-count').should('contain', '15'); // 15 đơn hàng như data mock

        // Kiểm tra block "Tổng tiền Chi tiêu" và format VNĐ (45.000.000 đ)
        // Regex format có thể thay đổi tùy thuộc môi trường, nên dùng include.text 
        cy.contains('Tổng tiền Chi tiêu').should('be.visible');
        cy.get('.total-spent-amount').should('contain', '45.000.000');
    });

    it('render biểu đồ Pie Chart thống kê các trạng thái', () => {
        cy.wait('@getUserOrderStats');

        // Tiêu đề khối biểu đồ
        cy.contains('Tỉ lệ Đơn hàng theo Trạng thái').should('be.visible');

        // Kiểm tra thẻ SVG sinh ra bởi thư viện Recharts
        cy.get('.recharts-surface').should('exist').and('be.visible');

        // Kiểm tra xem các trạng thái có xuất hiện ở chú thích (Legend) không
        cy.contains('Thành công').should('exist');
        cy.contains('Đang giao hàng').should('exist');
        cy.contains('Đã hủy').should('exist');
    });

    it('hiển thị màn hình báo lỗi khi API thất bại', () => {
        // Giả lập case API sập (500 Internal Server Error)
        cy.intercept('GET', '**/api/user/statistics/orders/*', {
            statusCode: 500,
            body: { message: 'Lỗi hệ thống' }
        }).as('getOrdersFail');

        cy.visit('/user/profile/statistics');
        cy.wait('@getOrdersFail');

        // Kiểm tra câu thông báo lỗi
        cy.contains('Không thể tải dữ liệu Thống kê Đơn hàng').should('be.visible');
    });
});
