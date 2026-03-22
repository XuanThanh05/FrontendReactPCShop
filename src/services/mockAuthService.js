import { MOCK_USERS } from "../data/mockUsers";

const USERS_STORAGE_KEY = "pcshop_mock_users";
const AUTH_STORAGE_KEY = "pcshop_current_user";
const AUTH_CHANGED_EVENT = "pcshop_auth_changed";

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUsername(value) {
  return sanitizeText(value).toLowerCase();
}

function getDemoUsername(user) {
  if (user?.id === "u-admin-01") return "admin";
  if (user?.id === "u-user-01") return "userdemo";
  return "";
}

function normalizeUserRecord(user, index) {
  const fallbackUsername =
    getDemoUsername(user) ||
    sanitizeText(user?.username) ||
    sanitizeText(user?.email).split("@")[0] ||
    `user${index + 1}`;

  return {
    ...user,
    username: normalizeUsername(fallbackUsername),
    phone: sanitizeText(user?.phone),
    fullName: sanitizeText(user?.fullName),
    email: sanitizeText(user?.email),
  };
}

function stripPassword(user) {
  if (!user) return null;
  const { password: _PASSWORD, ...safeUser } = user;
  return safeUser;
}

function readUsersFromStorage() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : null;
  } catch {
    return null;
  }
}

function writeUsersToStorage(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function emitAuthChanged(user) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGED_EVENT, {
      detail: { user: stripPassword(user) },
    })
  );
}

export function initializeMockUsers() {
  const existingUsers = readUsersFromStorage();
  if (!existingUsers || existingUsers.length === 0) {
    writeUsersToStorage(MOCK_USERS.map(normalizeUserRecord));
    return;
  }

  // Migrate existing localStorage records to include normalized username fields.
  const normalizedUsers = existingUsers.map(normalizeUserRecord);
  writeUsersToStorage(normalizedUsers);
}

export function getAllUsers() {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];
  return users.map(stripPassword);
}

export function loginWithMock({ username, password }) {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];

  const normalizedUsername = normalizeUsername(username);

  const matchedUser = users.find(
    (item) => item.username === normalizedUsername && item.password === password
  );

  if (!matchedUser) {
    throw new Error("Sai username hoặc mật khẩu.");
  }

  if (!matchedUser.isActive) {
    throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ admin.");
  }

  const safeUser = stripPassword(matchedUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
  emitAuthChanged(safeUser);
  return safeUser;
}

export function registerWithMock({
  fullName,
  username,
  password,
  email,
  phone,
}) {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];

  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    throw new Error("Username không được để trống.");
  }

  const existed = users.some((item) => item.username === normalizedUsername);
  if (existed) {
    throw new Error("Username đã tồn tại. Vui lòng chọn username khác.");
  }

  const newUser = normalizeUserRecord(
    {
      id: `u-${Date.now()}`,
      fullName,
      username: normalizedUsername,
      phone,
      password,
      email,
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    users.length
  );

  const updatedUsers = [...users, newUser];
  writeUsersToStorage(updatedUsers);

  const safeUser = stripPassword(newUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
  emitAuthChanged(safeUser);
  return safeUser;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutMock() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChanged(null);
}

export function isAdminUser(user) {
  return user?.role === "admin";
}

export function updateUserById(userId, updater) {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];
  const updatedUsers = users.map((item) => {
    if (item.id !== userId) return item;
    const changes = typeof updater === "function" ? updater(item) : updater;
    return { ...item, ...changes };
  });

  writeUsersToStorage(updatedUsers);

  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    const refreshedCurrent = updatedUsers.find((item) => item.id === userId);
    const safeUser = stripPassword(refreshedCurrent);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
    emitAuthChanged(safeUser);
  }

  return updatedUsers.map(stripPassword);
}

export function resetMockUsers() {
  writeUsersToStorage(MOCK_USERS.map(normalizeUserRecord));
}

export function subscribeAuthChanges(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event) => {
    if (event.key === AUTH_STORAGE_KEY || event.key === null) {
      listener(getCurrentUser());
    }
  };

  const onCustomAuthChange = (event) => {
    listener(event?.detail?.user ?? getCurrentUser());
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGED_EVENT, onCustomAuthChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGED_EVENT, onCustomAuthChange);
  };
}
