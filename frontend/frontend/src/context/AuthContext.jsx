import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
import API from "../api/axiosInstance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setUserLoading(false);
    myApplications();
  }, []);

  const registerUser = async (name, email, password) => {
    try {
      const res = await API.post("/applicant/register", {
        name,
        email,
        password,
      });
      console.log(res);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUserLoading(false);
    } catch (error) {
      console.error("Registration failed:", error);
      setUserLoading(false);
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const loginUser = async (email, password) => {
    setUserLoading(true);
    try {
      const res = await API.post("/applicant/login", { email, password });

      setUser(res.data);
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUserLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setUserLoading(false);
    }
  };

  const logoutUser = async () => {
    await API.post("/applicant/logout");
    localStorage.removeItem("user");
    setUser(null);
  };

  const adminLogin = async (email, password) => {
    setUserLoading(true);
    try {
      const res = await API.post("/admin/login", { email, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Admin login failed:", error);
      throw new Error(
        error.response?.data?.message || "Admin login failed. Please try again."
      );
    } finally {
      setUserLoading(false);
    }
  };

  const adminLogout = async () => {
    await API.post("/admin/logout");
    localStorage.removeItem("user");
    setUser(null);
  };

  const botLogin = async (email, password) => {
    setUserLoading(true);
    try {
      const res = await API.post("/bot-mimic/login", { email, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Bot login failed:", error);
      throw new Error(
        error.response?.data?.message || "Bot login failed. Please try again."
      );
    } finally {
      setUserLoading(false);
    }
  };

  const myApplications = async () => {
    try {
      const res = await API.get("/applicant/my-applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const allApplications = async () => {
    try {
      const res = await API.get("/admin/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch all applications:", error);
    }
  };

  const value = {
    user,
    userLoading,
    loginUser,
    logoutUser,
    registerUser,
    adminLogin,
    applications,
    myApplications,
    adminLogout,
    allApplications,
    botLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
