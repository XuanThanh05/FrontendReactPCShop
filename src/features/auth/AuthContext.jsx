import { useEffect, useMemo, useState } from "react";
import {
  initializeMockUsers,
  isAdminUser,
  loginWithMock,
  logoutMock,
  getCurrentUser,
  subscribeAuthChanges,
} from "../../services/mockAuthService";
import AuthContext from "./authContextInstance";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  useEffect(() => {
    initializeMockUsers();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((nextUser) => {
      setCurrentUser(nextUser);
    });

    const syncSession = () => {
      setCurrentUser(getCurrentUser());
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSession();
      }
    };

    window.addEventListener("focus", syncSession);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", syncSession);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const login = async (credentials) => {
    const loggedInUser = loginWithMock(credentials);
    setCurrentUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    logoutMock();
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isAdmin: isAdminUser(currentUser),
      login,
      logout,
      refreshSession: () => setCurrentUser(getCurrentUser()),
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
