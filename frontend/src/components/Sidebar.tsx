import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, ListTodo, Plus, LogOut } from 'lucide-react';

interface SidebarProps {
  onAddTask: () => void;
  onScrollToTasks?: () => void;
}

type ActiveMenu = 'my-tasks' | 'create-task' | null;

export default function Sidebar({ onAddTask, onScrollToTasks }: SidebarProps) {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

  const menuBtnCls = (id: ActiveMenu) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
      activeMenu === id
        ? 'bg-indigo-600 text-white'
        : 'text-white/55 hover:bg-white/8 hover:text-white/90 active:bg-indigo-600/70 active:text-white'
    }`;

  const handleMyTasks = () => {
    setActiveMenu('my-tasks');
    onScrollToTasks?.();
  };

  const handleCreateTask = () => {
    setActiveMenu('create-task');
    onAddTask();
    setTimeout(() => setActiveMenu(null), 300);
  };

  return (
    <aside className="w-52 min-h-screen bg-[#1E1B4B] flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="text-white font-semibold text-base leading-tight">My Task App</div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <NavLink
          to="/"
          end
          onClick={() => setActiveMenu(null)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-white/55 hover:bg-white/8 hover:text-white/90 active:bg-indigo-600/70 active:text-white'
            }`
          }>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <button type="button" onClick={handleMyTasks} className={menuBtnCls('my-tasks')}>
          <ListTodo size={16} />
          My Tasks
        </button>

        <button type="button" onClick={handleCreateTask} className={menuBtnCls('create-task')}>
          <Plus size={16} />
          Create Task
        </button>
      </nav>

      <div className="px-2 pb-4 border-t border-white/10 pt-3">
        <button type="button"
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-2 px-3 py-2 text-white/40 text-xs rounded-lg hover:text-red-400 hover:bg-white/5 active:bg-red-500/10 transition-all duration-150 disabled:opacity-50 cursor-pointer">
          <LogOut size={14} />
          {isPending ? 'Logging out...' : 'Logout'}
        </button>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 px-1">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || '??'}
          </div>
          <div className="min-w-0">
            <div className="text-white/80 text-xs font-medium truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-white/35 text-[10px] truncate">
              {user?.email || '-'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
