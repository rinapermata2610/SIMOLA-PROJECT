import { createContext, useContext, useState } from "react";
import { getCurrentUser, login as loginService, logout as logoutService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());

  async function login(username, password) {
    const loggedInUser = await loginService(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  const value = { user, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return context;
}
