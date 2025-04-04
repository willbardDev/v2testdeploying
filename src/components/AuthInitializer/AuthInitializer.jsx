// components/AuthInitializer/AuthInitializer.js
'use client';
import { useEffect } from 'react';
import axios from '../../lib/config';
import { useJumboAuth } from '@jumbo/hooks/useJumboAuth';

export const AuthInitializer = ({ children }) => {
  const { authData, setAuthData } = useJumboAuth();

  useEffect(() => {
    if (authData?.token) {
      axios.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${authData.token}` }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setAuthData(null);
        }
      });
    }
  }, [authData, setAuthData]);

  return children;
};