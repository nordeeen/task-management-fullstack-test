import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthCheck = requestUrl.includes('/auth/me');
    const isOnLoginPage = window.location.pathname === '/login';

    if (error.response?.status === 401 && !isAuthCheck && !isOnLoginPage) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
