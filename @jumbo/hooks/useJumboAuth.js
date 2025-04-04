// hooks/useJumboAuth.js
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  authData: null,
  setAuthData: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  // Load from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('authData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          // Add basic validation before setting
          if (parsedData?.token && parsedData?.authUser) {
            setAuthData(parsedData);
          } else {
            localStorage.removeItem('authData');
          }
        } catch (e) {
          localStorage.removeItem('authData');
        }
      }
    }
  }, []);

  // Update localStorage when authData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (authData?.token) {  // Only store if we have a token
        localStorage.setItem('authData', JSON.stringify(authData));
      } else {
        localStorage.removeItem('authData');
      }
    }
  }, [authData]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useJumboAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useJumboAuth must be used within an AuthProvider');
  }
  return context;
};