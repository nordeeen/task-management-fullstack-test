import { useState, useEffect } from 'react';
import type { Task, TaskFormData, ValidationErrors } from '../types';
import { validateForm } from '../utils';
import { Button } from './BtnCustom';
import { LucideX } from 'lucide-react';

interface Props {
  isOpen: boolean;
  editTask?: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
}

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
};

export default function TaskModal({
  isOpen,
  editTask,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editTask) {
      const toDateInput = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().slice(0, 10);
      };

      setForm({
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
        deadline: toDateInput(editTask.deadline),
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setTouched({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) {
      setErrors(validateForm(updated));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateForm(form));
  };

  const isFormValid =
    form.title.trim().length >= 3 &&
    form.deadline.trim() !== '' &&
    Object.keys(validateForm(form)).length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { title: true, description: true, deadline: true };
    setTouched(allTouched);
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <section
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {editTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h2>
          <Button type="button" onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer" 
            variant='ghost' size='icon'>
            <LucideX/>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Contoh: Buat laporan mingguan"
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none 
                focus:ring-2 focus:ring-indigo-300 transition 
                ${errors.title
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Detail tugas (opsional)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
              outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
              outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              min={(() => {
                // untuk mencegah user memilih tanggal hari ini atau sebelumnya
                const d = new Date();
                d.setDate(d.getDate() + 1);
                return d.toISOString().slice(0, 10);
              })()} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition ${
                errors.deadline
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300'
              }`}
            />
            {errors.deadline && (
              <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="ghost"
              size="lg"
              className="flex-1 border border-gray-300 text-gray-700 py-2 
              rounded-lg text-sm font-medium hover:text-red-500 hover:border-red-500 transition cursor-pointer">
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isFormValid || isLoading}
              className="flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer">
              {isLoading
                ? 'Menyimpan...'
                : editTask
                  ? 'Simpan Perubahan'
                  : 'Tambah Tugas'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
