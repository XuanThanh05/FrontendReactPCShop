import { MOCK_USERS } from "../data/mockUsers";

const USERS_STORAGE_KEY = "pcshop_mock_users";
const AUTH_STORAGE_KEY = "pcshop_current_user";

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

export function initializeMockUsers() {
  const existingUsers = readUsersFromStorage();
  if (!existingUsers || existingUsers.length === 0) {
    writeUsersToStorage(MOCK_USERS);
  }
}

export function getAllUsers() {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];
  return users.map(stripPassword);
}

export function loginWithMock({ phone, password }) {
  initializeMockUsers();
  const users = readUsersFromStorage() || [];

  const matchedUser = users.find(
    (item) => item.phone.trim() === phone.trim() && item.password === password
  );

  if (!matchedUser) {
    throw new Error("Sai số điện thoại hoặc mật khẩu.");
  }

  if (!matchedUser.isActive) {
    throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ admin.");
  }

  const safeUser = stripPassword(matchedUser);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
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
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stripPassword(refreshedCurrent)));
  }

  return updatedUsers.map(stripPassword);
}

export function resetMockUsers() {
  writeUsersToStorage(MOCK_USERS);
}
