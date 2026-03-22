import axiosClient from "./axiosClient";

function extractRole(rawRole, authorities = []) {
  if (typeof rawRole === "string" && rawRole.trim()) {
    const normalized = rawRole.toUpperCase();
    if (normalized.includes("ADMIN")) return "admin";
    return "customer";
  }

  const firstAuthority = authorities[0]?.authority || "";
  if (typeof firstAuthority === "string" && firstAuthority.toUpperCase().includes("ADMIN")) {
    return "admin";
  }

  return "customer";
}

function mapAuthPayload(payload) {
  const username = payload?.username || "";
  const role = extractRole(payload?.role, payload?.authorities || []);

  return {
    id: payload?.customerId || username,
    customerId: payload?.customerId || null,
    username,
    fullName: payload?.fullName || username,
    role,
    isActive: true,
  };
}

function normalizeApiError(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;
  const statusText = error?.response?.statusText;

  if (responseMessage && typeof responseMessage === "string") {
    return responseMessage;
  }

  if (statusText && typeof statusText === "string") {
    return statusText;
  }

  return fallbackMessage;
}

export async function loginWithApi({ username, password }) {
  try {
    const response = await axiosClient.post(
      "/auth/login",
      {
        username: username?.trim(),
        password,
      },
      { withCredentials: true }
    );

    return mapAuthPayload(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error, "Đăng nhập thất bại."));
  }
}

export async function registerWithApi({ username, fullName, email, password, phone }) {
  try {
    const response = await axiosClient.post(
      "/auth/register",
      {
        username: username?.trim(),
        fullName: fullName?.trim(),
        email: email?.trim(),
        password,
        phone: phone?.trim() || null,
      },
      { withCredentials: false }
    );

    return mapAuthPayload(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error, "Đăng ký thất bại."));
  }
}

export async function getCurrentUserFromApi() {
  try {
    const response = await axiosClient.get("/auth/me", { withCredentials: true });
    return mapAuthPayload(response.data);
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }

    throw new Error(normalizeApiError(error, "Không thể tải phiên đăng nhập."));
  }
}

export async function logoutApi() {
  try {
    await axiosClient.post("/auth/logout", null, { withCredentials: true });
  } catch {
    // Clear local auth state regardless of server response.
  }
}

export function isAdminUser(user) {
  return user?.role === "admin";
}
