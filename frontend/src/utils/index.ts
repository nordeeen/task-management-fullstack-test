import { useEffect, useState } from 'react';
import type { Task, TaskFormData, ValidationErrors } from '../types';

export const validateForm = (data: TaskFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  if (!data.title.trim()) {
    errors.title = 'Judul tidak boleh kosong';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Judul minimal 3 karakter';
  }
  if (data.deadline) {
    const date = new Date(data.deadline);
    if (isNaN(date.getTime())) {
      errors.deadline = 'Format tanggal tidak valid';
    }
  }
  return errors;
};

export const formatDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const isOverdue = (task: Task): boolean =>
  task.status !== 'done' &&
  !!task.deadline &&
  new Date(task.deadline) < new Date();

export const getGreeting = (): string => {
  const h = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
  ).getHours();

  if (h < 12) return 'Selamat Pagi';
  if (h < 17) return 'Selamat Siang';
  return 'Selamat Malam';
};

export const useDebounce = <T>(value: T, delay: number = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};
