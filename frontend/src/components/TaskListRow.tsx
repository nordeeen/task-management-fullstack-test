import { SquareCheckBig, SquarePen, Trash2 } from 'lucide-react';
import { STATUS_CONFIG } from '../constants';
import type { Task } from '../types';
import { Button } from './BtnCustom';

interface TaskListRowProps {
  task: Task;
  isOverdue?: boolean;
  formatDate: (d: string) => string | null;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskListRow({
  task,
  formatDate,
  onEdit,
  onDelete,
}: TaskListRowProps) {
  const statusLabel = STATUS_CONFIG[task.status];
  return (
    <div className="bg-[#13131f] border border-white/6 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-white/10 hover:bg-[#15151f] transition-all group">
      <span
        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${statusLabel.cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statusLabel.dot}`} />
        {statusLabel.label || '-'}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-200 truncate">
          {task.title || '-'}
        </div>
        <div className="text-xs text-gray-600 truncate mt-0.5">
          {task.description || '-'}
        </div>
      </div>

      <div className="text-xs shrink-0">
        {task.status === 'done' ? (
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <SquareCheckBig className="w-3.5 h-3.5" />
            Done
          </span>
        ) : task.deadline ? (
          <span className="text-gray-600">{formatDate(task.deadline)}</span>
        ) : (
          <span className="text-gray-700">—</span>
        )}
      </div>

      <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
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
  );
}
