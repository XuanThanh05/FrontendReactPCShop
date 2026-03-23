import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/user/statistics/orders';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Bỏ comment nếu dùng JWT
    }
});

export const userOrderStatisticsApi = {
    /**
     * Gọi API lấy dữ liệu thống kê đơn hàng của 1 user
     * @param {number|string} userId - ID của User
     * @returns Promise chứa UserOrderStatisticsDto
     */
    getMyOrderStatistics: async (userId) => {
        try {
            const response = await axiosInstance.get(`/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user order statistics:', error);
            throw error;
        }
    }
};
