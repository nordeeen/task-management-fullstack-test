import { useEffect, useState, useMemo } from 'react';
import { useTaskStore } from '../stores/taskStore';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import type { TaskStatus, Task, TaskFormData } from '../types';
import {
  CircleDashed,
  CircleUserRound,
  ClipboardMinus,
  LayoutGrid,
  LayoutList,
  Logs,
  PackagePlus,
  PackageSearch,
  Repeat2,
  SquareCheckBig,
  StickyNote,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TaskGridCard from '../components/TaskGridCard';
import TaskListRow from '../components/TaskListRow';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ITEMS_PER_PAGE, STATUS_FILTERS } from '../constants';
import { Button } from '../components/BtnCustom';

export default function DashboardPage() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(
    () =>
      tasks.filter((t: any) => {
        const matchSearch = t.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [tasks, search, statusFilter],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t: any) => t.status === 'pending').length,
      inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
      done: tasks.filter((t: any) => t.status === 'done').length,
      donePercent: tasks.length
        ? Math.round(
            (tasks.filter((t: any) => t.status === 'done').length /
              tasks.length) *
              100,
          )
        : 0,
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
    if (editTask) await updateTask(editTask.id, data);
    else await addTask(data);
    handleCloseModal();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = (task: Task) =>
    task.status !== 'done' &&
    task.deadline &&
    new Date(task.deadline) < new Date();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const authUser = (() => {
    try {
      const raw = localStorage.getItem('task_auth');
      return raw ? JSON.parse(raw)?.state?.user : null;
    } catch {
      return null;
    }
  })();

  return (
    <section className="flex h-screen bg-[#0f0f1a] overflow-hidden font-sans">
      <Sidebar onAddTask={handleOpenAdd} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#13131f] border-b border-white/6 px-6 py-3.5 flex items-center gap-4 shrink-0">
          <div className="flex-1 relative max-w-sm">
            <PackageSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a2e] border border-white/[0.07] rounded-xl text-sm text-gray-300
               placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="ml-auto flex items-center">
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/6">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                <CircleUserRound />
                {/* {authUser?.name?.slice(0, 2).toUpperCase() ?? 'U'} */}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold text-gray-200">
                  {authUser?.name ?? 'User'}
                </div>
                <div className="text-xs text-gray-600">Admin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 transition-colors ml-4"></button>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {getGreeting()},{' '}
                <span className="text-indigo-400">
                  {authUser?.name?.split(' ')[0] ?? 'there'}
                </span>
                .
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Kamu punya{' '}
                <span className="font-semibold text-gray-300">
                  {stats.pending + stats.inProgress}
                </span>{' '}
                tugas yang perlu diselesaikan hari ini.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="primary"
                onClick={handleOpenAdd}
                icon={<PackagePlus className="w-4 h-4" />}>
                Add Task
              </Button>
            </div>
          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <Button
                  key={f.value}
                  size="sm"
                  variant={statusFilter === f.value ? 'primary' : 'secondary'}
                  onClick={() => setStatusFilter(f.value)}>
                  {f.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 mr-1">
                {filtered.length} tugas
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

          {/* Task content */}
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

              <Button
                variant="dashed"
                onClick={handleOpenAdd}
                className="flex-col py-10 min-h-40 w-full group"
                icon={
                  <div className="w-10 h-10 rounded-xl bg-white/4 group-hover:bg-indigo-500/15 flex items-center justify-center transition-all">
                    <StickyNote className="w-5 h-5" />
                  </div>
                }>
                Create New Task
              </Button>
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
        isLoading={isLoading}
      />

      <DeleteConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (!confirmDeleteId) return;
          await deleteTask(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </section>
  );
}
