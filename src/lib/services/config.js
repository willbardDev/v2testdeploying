// lib/services/config.ts
import baseAxios from "axios";

// Timezone utility function (can be moved to a separate utils file if needed)
const getTimezoneOffset = () => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes < 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(timezoneOffsetMinutes / 60)).toString().padStart(2, '0');
  const minutes = Math.abs(timezoneOffsetMinutes % 60).toString().padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

// Create Axios instance with default configuration
const axios = baseAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Timezone': getTimezoneOffset()
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
axios.interceptors.request.use(
  (config) => {
    // Only try to add auth token if we're on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          if (typeof window !== 'undefined') {
            window.location.href = '/login?session_expired=true';
          }
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function for server-side requests
export const serverSideAxios = (token) => {
  return baseAxios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Timezone': getTimezoneOffset(),
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true,
    timeout: 10000,
  });
};

export default axios;