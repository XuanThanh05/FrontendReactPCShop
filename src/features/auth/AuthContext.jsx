import { useEffect, useMemo, useState } from "react";
import {
  initializeMockUsers,
  isAdminUser,
  loginWithMock,
  logoutMock,
  getCurrentUser,
} from "../../services/mockAuthService";
import AuthContext from "./authContextInstance";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  useEffect(() => {
    initializeMockUsers();
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
