import { create } from 'zustand';
import type { User } from '../types';

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
