import axiosClient from "./axiosClient";

/**
 * Đăng nhập bằng Google
 * @param {Object} credentialResponse - Response từ GoogleLogin component
 * @param {string} credentialResponse.credential - JWT ID token từ Google
 * @returns {Promise<Object>} User data với accessToken
 */
export const loginWithGoogle = async (credentialResponse) => {
  try {
    if (!credentialResponse || !credentialResponse.credential) {
      throw new Error("Google credential không hợp lệ");
    }

    // Gửi Google ID token đến backend
    const response = await axiosClient.post(
      "/auth/login-google",
      {
        idToken: credentialResponse.credential,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message;
    throw new Error(message || "Đăng nhập Google thất bại");
  }
};
