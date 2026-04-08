import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Bảng màu trạng thái: Chờ xử lý (Vàng), Đã xác nhận (Xanh lơ), Đang giao (Xanh dương), Thành công (Xanh lá), Đã hủy (Đỏ), v.v.
const COLORS = ['#f1c40f', '#00bcd4', '#3498db', '#2ecc71', '#e74c3c', '#9b59b6'];

const UserOrderStatisticsDashboard = ({ statistics, loading }) => {
    
    // Hàm format tiền tệ VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) return <div style={styles.loading}>Đang tải dữ liệu Thống kê...</div>;
    if (!statistics) return null;

    const safeTotalSpent = statistics.totalSpent || 0;
    const safeTotalOrders = statistics.totalOrders || 0;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Thống kê Hành trình Mua sắm</h2>
            
            <div style={styles.cardContainer}>
                <div style={{...styles.card, borderLeft: '5px solid #3498db'}}>
                    <h3 style={styles.cardTitle}>Tổng số Đơn hàng</h3>
                    <p style={styles.cardNumber} className="total-orders-count">
                        {safeTotalOrders}
                    </p>
                </div>
                
                <div style={{...styles.card, borderLeft: '5px solid #2ecc71'}}>
                    <h3 style={styles.cardTitle}>Tổng tiền Chi tiêu</h3>
                    <p style={{...styles.cardNumber, color: '#27ae60'}} className="total-spent-amount">
                        {formatCurrency(safeTotalSpent)}
                    </p>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Tỉ lệ Đơn hàng theo Trạng thái</h3>
                
                {statistics.statusStatistics && statistics.statusStatistics.length > 0 ? (
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statistics.statusStatistics}
                                    cx="50%" // Tọa độ trung tâm X
                                    cy="50%" // Tọa độ trung tâm Y
                                    labelLine={true}
                                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                                    outerRadius={110} // Kích thước hình tròn
                                    fill="#8884d8"
                                    dataKey="percentage" // Dựa trên phần trăm
                                    nameKey="status"     // Hiện tên trạng thái ra Legend
                                >
                                    {statistics.statusStatistics.map((entry, index) => {
                                        // Gán màu cố định nếu nhận diện được Trạng thái, nếu không random trong bảng màu
                                        let fillColor = COLORS[index % COLORS.length];
                                        if (entry.status === 'Đã hủy') fillColor = '#e74c3c';
                                        if (entry.status === 'Thành công') fillColor = '#2ecc71';
                                        if (entry.status === 'Đang giao hàng') fillColor = '#3498db';
                                        if (entry.status === 'Chờ xử lý') fillColor = '#f1c40f';
                                        
                                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                                    })}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '40px', color: '#95a5a6'}}>
                        <p>Bạn chưa có đơn hàng nào để vẽ biểu đồ.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Styles CSS cho Component (Inline để dễ demo và copy cho báo cáo)
const styles = {
    container: {
        padding: '24px',
        fontFamily: "'Inter', Arial, sans-serif",
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    title: {
        color: '#2c3e50',
        marginBottom: '24px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '10px'
    },
    cardContainer: {
        display: 'flex',
        gap: '24px',
        marginBottom: '32px',
        flexWrap: 'wrap'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        flex: '1',
        minWidth: '200px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    cardTitle: {
        color: '#7f8c8d',
        fontSize: '1rem',
        margin: '0 0 12px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    cardNumber: {
        color: '#2c3e50',
        fontSize: '2.2rem',
        fontWeight: 'bold',
        margin: '0',
        fontFamily: 'monospace'
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid #f1f3f5'
    },
    chartTitle: {
        textAlign: 'center',
        color: '#34495e',
        marginBottom: '24px',
        fontSize: '1.2rem'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#3498db',
        fontWeight: 'bold'
    },
    error: {
        textAlign: 'center',
        padding: '40px',
        color: '#e74c3c',
        backgroundColor: '#fdeded',
        borderRadius: '8px'
    }
};

export default UserOrderStatisticsDashboard;
