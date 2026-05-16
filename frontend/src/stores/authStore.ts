import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

const USERS_KEY = 'task_app_users';

interface StoredUser extends User {
  password: string;
}

const getStoredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 600));

        const users = getStoredUsers();
        const found = users.find(
          (u) => u.email === email && u.password === password,
        );

        if (!found) {
          throw new Error('Email atau password salah');
        }

        const { password: _pw, ...user } = found;
        const token = btoa(`${user.id}:${Date.now()}`);

        set({ user, token, isAuthenticated: true });
      },

      register: async (name: string, email: string, password: string) => {
        await new Promise((r) => setTimeout(r, 600));

        const users = getStoredUsers();
        if (users.find((u) => u.email === email)) {
          throw new Error('Email sudah terdaftar');
        }

        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
        };

        saveUser(newUser);

        const { password: _pw, ...user } = newUser;
        const token = btoa(`${user.id}:${Date.now()}`);

        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'task_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
