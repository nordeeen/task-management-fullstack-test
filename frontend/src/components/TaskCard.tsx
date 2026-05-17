import { SquarePen, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { Button } from './BtnCustom';
import { formatDate } from '../utils';
import { statusCardConfig } from '../constants';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const status = statusCardConfig[task.status];
  const isOverdue =
    task.status !== 'done' &&
    task.deadline &&
    new Date(task.deadline) < new Date();

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
              {task.deadline ? formatDate(task?.deadline) : '-'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => onEdit(task)}
            variant="secondary"
            size="icon"
            className="rounded-full p-1.5 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer"
            title="Edit">
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={() => onDelete(task?._id)}
            variant="danger"
            size="icon"
            className="rounded-full p-1.5 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
            title="Hapus">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
