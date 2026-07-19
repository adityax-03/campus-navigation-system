import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

const API_URL = `${API_BASE_URL}/api/auth`;

const safeParse = (str, fallback) => {
  if (!str || str === "undefined") return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

// Default mockup user profile matching the UI layout
const DEFAULT_MOCK_USER = {
  id: "mock-user-id-1",
  name: "Aditya Gupta",
  email: "aditya.gupta@college.edu",
  registrationNo: "2023CS45",
  role: "Student",
  favorites: ["block-32", "block-34"],
  history: [
    {
      from: "Block 32 (Admission)",
      to: "Block 38 (Civil Eng)",
      date: new Date().toISOString(),
      distance: "490m",
      time: "7 min"
    }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("ccns-token");
      if (token) {
        // Set Axios authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          // Attempt real backend call
          const res = await axios.get(`${API_URL}/me`, { timeout: 2000 });
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn("Backend auth failed, falling back to mock session:", err.message);
          // Backend offline or error, try local storage mock user
          const mockUser = localStorage.getItem("ccns-mock-user");
          setUser(safeParse(mockUser, DEFAULT_MOCK_USER));
        }
      } else {
        // No token, see if mock user is logged in
        const mockActive = localStorage.getItem("ccns-mock-active") === "true";
        if (mockActive) {
          const mockUser = localStorage.getItem("ccns-mock-user");
          setUser(safeParse(mockUser, DEFAULT_MOCK_USER));
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ccns-token");
    localStorage.removeItem("ccns-mock-active");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const login = async (emailOrRegNo, password) => {
    setError(null);
    setLoading(true);
    try {
      // 1. Try real login
      const res = await axios.post(`${API_URL}/login`, {
        email: emailOrRegNo.includes("@") ? emailOrRegNo : undefined,
        registrationNo: !emailOrRegNo.includes("@") ? emailOrRegNo : undefined,
        password
      });

      if (res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem("ccns-token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(loggedUser);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn("Backend login failed:", err.response?.data?.message || err.message);
      
      // If backend responded with an error, return the actual error instead of falling back to mock
      if (err.response && err.response.data && err.response.data.message) {
        setLoading(false);
        setError(err.response.data.message);
        return { success: false, message: err.response.data.message };
      }
      
      // 2. Mock Fallback (only if backend is offline/network error)
      let mockUsers = safeParse(localStorage.getItem("ccns-mock-users-list"), []);
      
      // Add default mock user to database list if it's empty
      if (mockUsers.length === 0) {
        mockUsers.push({ ...DEFAULT_MOCK_USER, password: "password123" });
        localStorage.setItem("ccns-mock-users-list", JSON.stringify(mockUsers));
      }

      const match = mockUsers.find(
        u => (u.email === emailOrRegNo || u.registrationNo === emailOrRegNo) && u.password === password
      );

      if (match || password === "password123") { // Backdoor password for easy testing
        const loggedUser = match ? { ...match } : { ...DEFAULT_MOCK_USER };
        delete loggedUser.password;
        
        localStorage.setItem("ccns-mock-active", "true");
        localStorage.setItem("ccns-mock-user", JSON.stringify(loggedUser));
        setUser(loggedUser);
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      setError("Invalid credentials. Try any email with password 'password123' to test.");
      return { success: false, message: "Invalid credentials." };
    }
  };

  const register = async (name, registrationNo, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        registrationNo,
        email,
        password
      });

      if (res.data.success) {
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn("Backend register failed:", err.response?.data?.message || err.message);

      // If backend responded with an error (e.g. duplicate user), return the actual error instead of falling back to mock
      if (err.response && err.response.data && err.response.data.message) {
        setLoading(false);
        setError(err.response.data.message);
        return { success: false, message: err.response.data.message };
      }

      // Create new mock user (only if backend is offline/network error)
      const newMockUser = {
        id: `mock-user-${Date.now()}`,
        name,
        email,
        registrationNo,
        role: "Student",
        favorites: [],
        history: [],
        password // Keep it inside local DB list
      };

      let mockUsers = safeParse(localStorage.getItem("ccns-mock-users-list"), []);
      mockUsers.push(newMockUser);
      localStorage.setItem("ccns-mock-users-list", JSON.stringify(mockUsers));

      setLoading(false);
      return { success: true };
    }
  };

  const updateFavorites = async (favorites) => {
    if (!user) return;
    
    // Update local user state
    const updatedUser = { ...user, favorites };
    setUser(updatedUser);

    // Sync mock
    if (localStorage.getItem("ccns-mock-active") === "true") {
      localStorage.setItem("ccns-mock-user", JSON.stringify(updatedUser));
      // Sync list
      let mockUsers = safeParse(localStorage.getItem("ccns-mock-users-list"), []);
      const index = mockUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        mockUsers[index].favorites = favorites;
        localStorage.setItem("ccns-mock-users-list", JSON.stringify(mockUsers));
      }
    }

    // Sync backend
    try {
      await axios.put(`${API_BASE_URL}/api/user/favorites`, { favorites });
    } catch (err) {
      console.warn("Could not sync favorites to backend:", err.message);
    }
  };

  const addHistory = async (routeLog) => {
    if (!user) return;

    const newLog = {
      from: routeLog.from,
      to: routeLog.to,
      date: new Date().toISOString(),
      distance: routeLog.distance,
      time: routeLog.time
    };

    const updatedUser = {
      ...user,
      history: [newLog, ...(user.history || [])]
    };
    setUser(updatedUser);

    if (localStorage.getItem("ccns-mock-active") === "true") {
      localStorage.setItem("ccns-mock-user", JSON.stringify(updatedUser));
      // Sync list
      let mockUsers = safeParse(localStorage.getItem("ccns-mock-users-list"), []);
      const index = mockUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        mockUsers[index].history = updatedUser.history;
        localStorage.setItem("ccns-mock-users-list", JSON.stringify(mockUsers));
      }
    }

    try {
      await axios.post(`${API_BASE_URL}/api/user/history`, routeLog);
    } catch (err) {
      console.warn("Could not sync history to backend:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout: handleLogout,
        updateFavorites,
        addHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
