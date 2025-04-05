'use client';
import { useEffect } from 'react';
import axios from '../../lib/config';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';

export const AuthInitializer = ({ children }) => {
  const { authData, setAuthValues } = useJumboAuth();

  useEffect(() => {
    if (authData?.token) {
      axios.get('/api/auth/validate', {
        headers: { Authorization: `Bearer ${authData.token}` }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setAuthValues(null);
        }
      });
    }
  }, [authData, setAuthValues]);

  return children;
};