import { create } from 'zustand';
import type { Task, TaskState } from '../types';
import { useAuthStore } from './authStore';

const TASKS_KEY = 'task_app_tasks';

const getStoredTasks = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Simulasi token expiry check
const checkTokenValid = (): boolean => {
  const auth = useAuthStore.getState();
  if (!auth.token) return false;
  try {
    const [, timestamp] = atob(auth.token).split(':');
    // Token expires after 24 jam
    return Date.now() - Number(timestamp) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    if (!checkTokenValid()) {
      useAuthStore.getState().logout();
      set({ error: 'Sesi telah berakhir. Silakan login kembali.' });
      return;
    }

    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));

    const userId = useAuthStore.getState().user?.id;
    const allTasks = getStoredTasks();
    const userTasks = allTasks.filter((t) => t.userId === userId);

    set({ tasks: userTasks, isLoading: false });
  },

  addTask: async (taskData) => {
    if (!checkTokenValid()) {
      useAuthStore.getState().logout();
      set({ error: 'Sesi telah berakhir. Silakan login kembali.' });
      return;
    }

    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));

    const userId = useAuthStore.getState().user?.id!;
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId,
    };

    const allTasks = getStoredTasks();
    saveTasks([...allTasks, newTask]);

    set((state) => ({
      tasks: [...state.tasks, newTask],
      isLoading: false,
    }));
  },

  updateTask: async (id, taskData) => {
    if (!checkTokenValid()) {
      useAuthStore.getState().logout();
      set({ error: 'Sesi telah berakhir. Silakan login kembali.' });
      return;
    }

    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 400));

    const allTasks = getStoredTasks();
    const updated = allTasks.map((t) =>
      t.id === id ? { ...t, ...taskData } : t,
    );
    saveTasks(updated);

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)),
      isLoading: false,
    }));
  },

  deleteTask: async (id) => {
    if (!checkTokenValid()) {
      useAuthStore.getState().logout();
      set({ error: 'Sesi telah berakhir. Silakan login kembali.' });
      return;
    }

    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 300));

    const allTasks = getStoredTasks();
    saveTasks(allTasks.filter((t) => t.id !== id));

    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      isLoading: false,
    }));
  },

  clearError: () => set({ error: null }),
}));
