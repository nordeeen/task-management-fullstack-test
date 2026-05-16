import type { TaskStatus } from '../types';

export const ITEMS_PER_PAGE = 6;

export const STATUS_FILTERS: { value: 'all' | TaskStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const STATUS_CONFIG = {
  pending: {
    label: 'PENDING',
    cls: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
    dot: 'bg-amber-400',
  },
  'in-progress': {
    label: 'IN PROGRESS',
    cls: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
    dot: 'bg-blue-400',
  },
  done: {
    label: 'DONE',
    cls: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};
