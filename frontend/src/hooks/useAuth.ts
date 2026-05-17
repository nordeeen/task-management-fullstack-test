import { useQuery } from '@tanstack/react-query';
import { getMe } from '../services/auth';

export const useAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

  return {
    user: data?.data ?? null,
    isLoading,
    isAuthenticated: !!data?.data,
  };
};