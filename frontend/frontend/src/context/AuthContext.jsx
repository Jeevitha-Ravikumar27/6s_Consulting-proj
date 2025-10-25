import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (userData, userRole, authToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(authToken);
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


export const getAuthToken = () => {
  return localStorage.getItem("token") || "";
};

export default AuthContext;
