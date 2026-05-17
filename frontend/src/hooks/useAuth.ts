import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMe } from '../services/auth';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { setUser, clearUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    } else if (!isLoading) {
      clearUser();
    }
  }, [data, isLoading]);

  return {
    user: data?.data ?? null,
    isLoading,
    isAuthenticated: !!data?.data,
  };
};