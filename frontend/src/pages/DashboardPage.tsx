import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import type { TaskStatus, Task, TaskFormData } from '../types';
import {
  CircleDashed,
  ClipboardMinus,
  LayoutGrid,
  LayoutList,
  Logs,
  PackagePlus,
  Repeat2,
  SquareCheckBig,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TaskGridCard from '../components/TaskGridCard';
import TaskListRow from '../components/TaskListRow';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ITEMS_PER_PAGE, STATUS_FILTERS } from '../constants';
import { Button } from '../components/BtnCustom';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/useTasks';
import { formatDate, isOverdue, getGreeting, useDebounce } from '../utils';

export default function DashboardPage() {
  const authUser = useAuthStore((state) => state.user);
  const taskListRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { mutateAsync: createTask, isPending: isCreatePending } =
    useCreateTask();
  const { mutateAsync: updateTaskMutation, isPending: isUpdatePending } =
    useUpdateTask();
  const { mutateAsync: deleteTaskMutation, isPending: isDeletePending } =
    useDeleteTask();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const {
    data: taskResponse,
    isLoading,
    error,
  } = useTasks({
    status: statusFilter,
    q: debouncedSearch,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const tasks = taskResponse?.data ?? [];
  const totalPages = taskResponse?.totalPages ?? 1;
  const paginated = tasks;

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks],
  );

  const handleOpenAdd = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (task: Task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  const handleSubmit = async (data: TaskFormData) => {
    if (editTask) {
      await updateTaskMutation({ id: (editTask as any)._id, data });
    } else {
      await createTask(data);
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteTaskMutation(id);
    setConfirmDeleteId(null);
  };

  return (
    <section className="flex h-screen bg-[#0f0f1a] overflow-hidden font-sans">
      <Sidebar
        onAddTask={handleOpenAdd}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={authUser?.name}
          search={search}
          onSearchChange={setSearch}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error.message || 'Gagal memuat tugas. Coba refresh halaman.'}
            </div>
          )}

          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {getGreeting()},{' '}
                <span className="text-indigo-400 capitalize">
                  {authUser?.name?.split(' ')[0] ?? '-'}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Kamu punya{' '}
                <span className="font-semibold text-gray-300">
                  {stats.pending + stats.inProgress}
                </span>{' '}
                tugas yang perlu diselesaikan.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                onClick={handleOpenAdd}
                icon={<PackagePlus className="w-4 h-4" />}>
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Total Tasks"
              value={stats.total}
              trend=""
              trendUp
              icon={<Logs className="w-5 h-5" />}
              iconBg="bg-indigo-500/15 text-indigo-400"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              badge=""
              badgeCls="bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
              icon={<CircleDashed className="w-5 h-5" />}
              iconBg="bg-amber-500/15 text-amber-400"
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              badge=""
              badgeCls="bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20"
              icon={<Repeat2 className="w-5 h-5" />}
              iconBg="bg-blue-500/15 text-blue-400"
            />
            <StatCard
              label="Done"
              value={stats.done}
              badge={''}
              badgeCls="bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
              icon={<SquareCheckBig className="w-5 h-5" />}
              iconBg="bg-emerald-500/15 text-emerald-400"
            />
          </div>

          {/* Filter Status Task */}
          <div
            ref={taskListRef}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {STATUS_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  size="sm"
                  className="capitalize cursor-pointer"
                  variant={statusFilter === f.value ? 'primary' : 'secondary'}
                  onClick={() => setStatusFilter(f.value)}>
                  {f.label || '-'}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 mr-1">
                {tasks?.length || 0} tugas
              </span>
              <div className="flex gap-1 bg-[#1a1a2e] border border-white/[0.07] rounded-xl p-1">
                <Button
                  size="icon"
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                  icon={<LayoutGrid className="w-3.5 h-3.5" />}
                />
                <Button
                  size="icon"
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  title="List view"
                  icon={<LayoutList className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">Memuat tugas...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#13131f] border border-dashed border-white/[0.07] rounded-2xl">
              <div className="w-14 h-14 bg-[#1a1a2e] rounded-2xl flex items-center justify-center mb-4">
                <ClipboardMinus className="w-7 h-7 text-gray-700" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {search || statusFilter !== 'all'
                  ? 'Tidak ada tugas yang cocok'
                  : 'Belum ada tugas'}
              </p>
              <p className="text-gray-700 text-xs mb-4">
                {search || statusFilter !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian'
                  : 'Mulai dengan membuat tugas pertamamu'}
              </p>
              {!search && statusFilter === 'all' && (
                <Button
                  variant="primary"
                  onClick={handleOpenAdd}
                  icon={<PackagePlus className="w-4 h-4" />}>
                  Add Task
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((task: any) => (
                <TaskGridCard
                  key={task.id}
                  task={task}
                  isOverdue={!!isOverdue(task)}
                  formatDate={formatDate}
                  onEdit={handleOpenEdit}
                  onDelete={setConfirmDeleteId}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {paginated.map((task: any) => (
                <TaskListRow
                  key={task.id}
                  task={task}
                  isOverdue={!!isOverdue(task)}
                  formatDate={formatDate}
                  onEdit={handleOpenEdit}
                  onDelete={setConfirmDeleteId}
                />
              ))}
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        editTask={editTask}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isCreatePending || isUpdatePending}
      />
      <DeleteConfirmModal
        isOpen={!!confirmDeleteId}
        loading={isDeletePending}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
      />
    </section>
  );
}
