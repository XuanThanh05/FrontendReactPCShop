import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Gửi HttpOnly cookie theo mọi request
});

// Tự động gắn JWT token vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage — điều chỉnh key nếu bạn lưu khác
    const authCache = localStorage.getItem("pcshop_auth_cache");
    if (authCache) {
      try {
        const user = JSON.parse(authCache);
        const token = user.token ?? user.accessToken ?? user.jwt;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (_) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;