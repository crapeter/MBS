import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem("isLoggedIn");
    return storedValue === "true";
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedValue = localStorage.getItem("isAdmin");
    return storedValue === "true";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("userEmail") || "";
  });

  const [userLocation, setUserLocation] = useState(() => {
    return localStorage.getItem("userLocation") || "";
  });

  useEffect(() => {
    if (isLoggedIn !== null) {
      localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isAdmin !== null) {
      localStorage.setItem("isAdmin", isAdmin.toString());
    }
  }, [isAdmin]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem("userLocation", userLocation);
    }
  }, [userLocation]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAdmin,
        setIsAdmin,
        userEmail,
        setUserEmail,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
