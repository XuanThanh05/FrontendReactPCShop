import axiosClient from './axiosClient';

export const userOrderStatisticsApi = {
    /**
     * Gọi API lấy dữ liệu thống kê đơn hàng của 1 user
     * @param {number|string} userId - ID của User
     * @returns Promise chứa UserOrderStatisticsDto
     */
    getMyOrderStatistics: async (userId) => {
        try {
            const response = await axiosClient.get(`/user/statistics/orders/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user order statistics:', error);
            throw error;
        }
    }
};
