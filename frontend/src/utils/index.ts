import type { TaskFormData, ValidationErrors } from "../types";

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