import { useEffect, useMemo, useState } from "react";
import {
  getCurrentUserFromApi,
  isAdminUser,
  loginWithApi,
  logoutApi,
  registerWithApi,
} from "../../services/authService";
import AuthContext from "./authContextInstance";

const AUTH_CACHE_KEY = "pcshop_auth_cache";

function readCachedUser() {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCachedUser(user) {
  if (!user) return;
  localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
}

function clearCachedUser() {
  localStorage.removeItem(AUTH_CACHE_KEY);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readCachedUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const cachedUser = readCachedUser();
      if (active && cachedUser) {
        setCurrentUser(cachedUser);
      }

      try {
        const user = await getCurrentUserFromApi();
        if (active) {
          setCurrentUser(user);
          if (user) {
            writeCachedUser(user);
          } else {
            clearCachedUser();
          }
        }
      } catch {
        // Keep cached auth state when backend/network is temporarily unavailable.
      } finally {
        if (active) {
          setIsAuthLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const loggedInUser = await loginWithApi(credentials);
    setCurrentUser(loggedInUser);
    writeCachedUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const createdUser = await registerWithApi(payload);
    setCurrentUser(createdUser);
    writeCachedUser(createdUser);
    return createdUser;
  };

  const logout = async () => {
    await logoutApi();
    setCurrentUser(null);
    clearCachedUser();
  };

  const refreshSession = async () => {
    try {
      const user = await getCurrentUserFromApi();
      setCurrentUser(user);
      if (user) {
        writeCachedUser(user);
      } else {
        clearCachedUser();
      }
      return user;
    } catch (error) {
      const cachedUser = readCachedUser();
      if (cachedUser) {
        setCurrentUser(cachedUser);
        return cachedUser;
      }
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthLoading,
      isAuthenticated: Boolean(currentUser),
      isAdmin: isAdminUser(currentUser),
      login,
      register,
      logout,
      refreshSession,
    }),
    [currentUser, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
