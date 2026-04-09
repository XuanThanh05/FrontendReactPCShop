import axiosClient from "./axiosClient";

function buildAdminAuthConfig() {
  const config = { withCredentials: true };

  try {
    const raw = localStorage.getItem("pcshop_auth_cache");
    if (!raw) return config;

    const parsed = JSON.parse(raw);
    const token = String(parsed?.accessToken || parsed?.token || parsed?.jwt || "").trim();
    if (!token) return config;

    const tokenType = String(parsed?.tokenType || "Bearer").trim() || "Bearer";
    const authValue = /^bearer\s+/i.test(token) ? token : `${tokenType} ${token}`;

    return {
      ...config,
      headers: {
        Authorization: authValue,
      },
    };
  } catch {
    return config;
  }
}

function toUserRow(apiUser) {
  const role = String(apiUser?.role || "CUSTOMER").toUpperCase();

  return {
    id: apiUser?.id,
    username: apiUser?.username || "",
    fullName: apiUser?.username || "",
    phone: apiUser?.phone || "",
    email: apiUser?.email || "",
    role: role.includes("ADMIN") ? "admin" : "customer",
    isActive: Boolean(apiUser?.enabled),
    emailVerified: Boolean(apiUser?.emailVerified),
    createdAt: apiUser?.createdAt || new Date().toISOString(),
    customerId: apiUser?.customerId || null,
  };
}

function normalizeApiError(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export async function getAdminUsersApi() {
  try {
    const response = await axiosClient.get("/admin/users", buildAdminAuthConfig());
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(toUserRow);
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể tải danh sách người dùng."));
  }
}

export async function deleteAdminUserApi(userId) {
  try {
    await axiosClient.delete(`/admin/users/${userId}`, buildAdminAuthConfig());
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể xóa tài khoản."));
  }
}

export async function updateAdminUserStatusApi(userId, enabled) {
  try {
    await axiosClient.put(
      `/admin/users/${userId}/status`,
      { enabled },
      buildAdminAuthConfig()
    );
  } catch (error) {
    throw new Error(normalizeApiError(error, "Không thể cập nhật trạng thái tài khoản."));
  }
}