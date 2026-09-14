import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
  const storedUser = localStorage.getItem("biterush_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("biterush_user");

    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("biterush_token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem(
      "biterush_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "biterush_token",
      userToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("biterush_user");
    localStorage.removeItem("biterush_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}