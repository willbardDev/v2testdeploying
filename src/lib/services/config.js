import baseAxios from "axios";

const getTimezoneOffset = () => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes < 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(timezoneOffsetMinutes / 60)).toString().padStart(2, '0');
  const minutes = Math.abs(timezoneOffsetMinutes % 60).toString().padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

// Base axios instance (shared across client & server)
const axios = baseAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Timezone': getTimezoneOffset(),
  },
  withCredentials: true,
  timeout: 10000,
});

// Interceptor (server-only cookie injection if needed)
axios.interceptors.request.use(async (config) => {
  // Skip for internal Next.js API routes
  if (config.url?.startsWith('/api/')) {
    config.baseURL = ''; // disable the base URL
  }

  // SERVER SIDE
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieString = cookies()
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

      if (cookieString) {
        config.headers.Cookie = cookieString;
      }
    } catch (error) {
      console.error('Failed to attach cookies on server:', error);
    }
  }

  return config;
});

// Server-side custom axios instance with cookies
export const serverSideAxios = async () => {
  const { cookies } = await import('next/headers');
  const cookieString = cookies()
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');

  return baseAxios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Timezone': getTimezoneOffset(),
      ...(cookieString && { Cookie: cookieString }),
    },
    withCredentials: true,
    timeout: 10000,
  });
};

export default axios;
