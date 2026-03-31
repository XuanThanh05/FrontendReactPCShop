import axiosClient from "./axiosClient";

const AUTH_CACHE_KEY = "pcshop_auth_cache";

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

function readCachedAuth() {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeToken(tokenValue, tokenTypeValue = "Bearer") {
  if (typeof tokenValue !== "string") {
    return { accessToken: null, tokenType: tokenTypeValue || "Bearer" };
  }

  const trimmed = tokenValue.trim();
  if (!trimmed) {
    return { accessToken: null, tokenType: tokenTypeValue || "Bearer" };
  }

  const [maybeType, ...rest] = trimmed.split(" ");
  if (rest.length > 0 && /^bearer$/i.test(maybeType)) {
    return {
      accessToken: rest.join(" ").trim() || null,
      tokenType: "Bearer",
    };
  }

  return {
    accessToken: trimmed,
    tokenType: tokenTypeValue || "Bearer",
  };
}

function isAnonymousPayload(payload) {
  const username = String(payload?.username || "").trim().toLowerCase();
  const hasAnonymousAuthority = Array.isArray(payload?.authorities)
    ? payload.authorities.some((item) =>
        String(item?.authority || "")
          .toUpperCase()
          .includes("ANONYMOUS")
      )
    : false;

  return username === "anonymoususer" || hasAnonymousAuthority;
}

function mapAuthPayload(payload, fallbackAuth = null) {
  const username = payload?.username || "";
  const role = extractRole(payload?.role, payload?.authorities || []);
  const rawAccessToken =
    payload?.accessToken || payload?.token || payload?.jwt || fallbackAuth?.accessToken || fallbackAuth?.token || fallbackAuth?.jwt || null;
  const rawTokenType = payload?.tokenType || fallbackAuth?.tokenType || "Bearer";
  const { accessToken, tokenType } = normalizeToken(rawAccessToken, rawTokenType);

  return {
    id: payload?.customerId || username,
    customerId: payload?.customerId || null,
    username,
    fullName: payload?.fullName || username,
    role,
    isActive: true,
    accessToken,
    tokenType,
  };
}

function normalizeApiError(error, fallbackMessage) {
  const responseData = error?.response?.data;
  const responseMessage = responseData?.message;
  const statusText = error?.response?.statusText;

  if (responseMessage && typeof responseMessage === "string") {
    return responseMessage;
  }

  if (responseData && typeof responseData === "object") {
    const firstValue = Object.values(responseData)[0];
    if (typeof firstValue === "string" && firstValue.trim()) {
      return firstValue;
    }
  }

  if (statusText && typeof statusText === "string") {
    return statusText;
  }

  return fallbackMessage;
}

export async function loginWithApi({ identifier, username, password }) {
  try {
    const loginIdentifier = (identifier || username || "").trim();

    const response = await axiosClient.post(
      "/auth/login",
      {
        username: loginIdentifier,
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
    const cachedAuth = readCachedAuth();
    const response = await axiosClient.get("/auth/me", { withCredentials: true });

    if (isAnonymousPayload(response.data)) {
      return cachedAuth || null;
    }

    return mapAuthPayload(response.data, cachedAuth);
  } catch (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }

    throw new Error(normalizeApiError(error, "Không thể tải phiên đăng nhập."));
  }
}

export async function loginWithGoogleApi(credentialResponse) {
  try {
    if (!credentialResponse || !credentialResponse.credential) {
      throw new Error("Google credential không hợp lệ");
    }

    const response = await axiosClient.post(
      "/auth/login-google",
      {
        idToken: credentialResponse.credential,
      },
      { withCredentials: true }
    );

    return mapAuthPayload(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error, "Đăng nhập Google thất bại."));
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
