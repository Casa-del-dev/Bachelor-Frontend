import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AUTH_TOKEN_KEY = "authToken";
const AUTH_TIMESTAMP_KEY = "authTimestamp";
const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  React.useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);

    if (token && timestamp) {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      if (timeElapsed < EXPIRATION_MS) {
        setIsAuthenticated(true);
      } else {
        // Expired
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_TIMESTAMP_KEY);
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
