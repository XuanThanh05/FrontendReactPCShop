import { useEffect, useMemo, useState } from "react";
import {
  getCurrentUserFromApi,
  isAdminUser,
  loginWithApi,
  logoutApi,
  registerWithApi,
} from "../../services/authService";
import AuthContext from "./authContextInstance";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const user = await getCurrentUserFromApi();
        if (active) {
          setCurrentUser(user);
        }
      } catch {
        if (active) {
          setCurrentUser(null);
        }
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
    return loggedInUser;
  };

  const register = async (payload) => {
    const createdUser = await registerWithApi(payload);
    setCurrentUser(createdUser);
    return createdUser;
  };

  const logout = async () => {
    await logoutApi();
    setCurrentUser(null);
  };

  const refreshSession = async () => {
    const user = await getCurrentUserFromApi();
    setCurrentUser(user);
    return user;
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
