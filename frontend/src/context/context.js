"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// Custom hook
export const context = () => useContext(UserContext);

// Context Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load from localStorage (on client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedStatus = localStorage.getItem("isLoggedIn");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedStatus) setIsLoggedIn(JSON.parse(storedStatus));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    }
  }, [user, isLoggedIn]);

  const login = (user) => {
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("Logging out...");
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.setItem("user","");
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
