import type { Task } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  done: { label: 'Done', color: 'bg-green-100 text-green-800' },
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const status = statusConfig[task.status];
  const isOverdue =
    task.status !== 'done' &&
    task.deadline &&
    new Date(task.deadline) < new Date();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {task.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">Deadline:</span>
            <span
              className={`font-medium ${
                isOverdue ? 'text-red-500' : 'text-gray-600'
              }`}>
              {task.deadline ? formatDate(task.deadline) : '-'}
              {isOverdue && ' ⚠ Terlambat'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg font-medium transition">
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg font-medium transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
