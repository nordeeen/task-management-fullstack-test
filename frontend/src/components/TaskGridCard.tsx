import {
  CircleDashed,
  ClipboardClock,
  SquareCheckBig,
  SquarePen,
  Trash2,
} from 'lucide-react';
import { STATUS_CONFIG } from '../constants';
import type { Task } from '../types';
import { Button } from './BtnCustom';

interface TaskGridCardProps {
  task: Task;
  isOverdue?: boolean;
  formatDate: (d: string) => string | null;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskGridCard({
  task,
  isOverdue,
  formatDate,
  onEdit,
  onDelete,
}: TaskGridCardProps) {
  const statusLabel = STATUS_CONFIG[task.status];
  return (
    <div className="bg-[#13131f] border border-white/6 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 hover:bg-[#15151f] transition-all group">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg ${statusLabel.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusLabel.dot}`} />
          {statusLabel.label}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <Button
            onClick={() => onEdit(task)}
            variant="secondary"
            size="icon"
            className="rounded-full p-1.5 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer"
            title="Edit">
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={() => onDelete(task._id)}
            variant="danger"
            size="icon"
            className="rounded-full p-1.5 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
            title="Hapus">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-200 text-sm leading-snug mb-1.5">
          {task?.title || '-'}
        </h3>
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {task?.description || '-'}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-white/5">
        {task.status === 'done' ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <SquareCheckBig className="w-3.5 h-3.5" />
            Done
          </span>
        ) : isOverdue ? (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <CircleDashed className="w-5 h-5" />
            Pending
          </span>
        ) : task.deadline ? (
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <ClipboardClock className="w-3.5 h-3.5" />
            {formatDate(task.deadline)}
          </span>
        ) : (
          <span className="text-xs text-gray-700">No deadline</span>
        )}
      </div>
    </div>
  );
};