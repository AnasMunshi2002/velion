import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        // Skip token verification for development - just load saved data
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    // Bypass authentication for development - just navigate to dashboard
    const mockToken = "mock-jwt-token";
    const mockUser = {
      id: 1,
      email: email || "user@example.com",
      name: "Test User",
      role: "USER",
      employeeId: "EMP001",
      profileCompletion: 100,
    };

    localStorage.setItem("authToken", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    setToken(mockToken);
    setUser(mockUser);

    return { success: true, user: mockUser };
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
    isAdmin: user?.role === "ADMIN",
    isKnowledgeChampion: user?.role === "KNOWLEDGE_CHAMPION",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
