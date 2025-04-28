import React, { createContext, useContext, ReactNode } from "react";
import { AUTH_TOKEN_KEY, useAuth } from "./AuthContext";

interface ApiContextType {
  fetch: (endpoint: string, init?: RequestInit) => Promise<Response>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const fetchApi = async (
    endpoint: string,
    init?: RequestInit
  ): Promise<Response> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY); // Get the auth token

    const headers = {
      ...init?.headers,
      Authorization: token ? `Bearer ${token}` : "",
    };

    const response = await fetch(
      `https://bachelor-api.erenhomburg.com/${endpoint}`,
      {
        ...init,
        headers,
      }
    );

    if (response.status === 401) {
      useAuth().logout();
    }

    return response;
  };

  return (
    <ApiContext.Provider value={{ fetch: fetchApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
