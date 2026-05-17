import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { LayoutDashboard, Plus, LogOut, X } from 'lucide-react';
import { Button } from './BtnCustom';

interface SidebarProps {
  onAddTask: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type ActiveMenu = 'my-tasks' | 'create-task' | null;

export default function Sidebar({
  onAddTask,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const { mutate: logout, isPending } = useLogout();
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

  const menuBtnCls = (id: ActiveMenu) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
      activeMenu === id
        ? 'bg-indigo-600 text-white'
        : 'text-white/55 hover:bg-white/8 hover:text-white/90 active:bg-indigo-600/70 active:text-white'
    }`;

  const handleCreateTask = () => {
    setActiveMenu('create-task');
    onAddTask();
    onClose?.();
    setTimeout(() => setActiveMenu(null), 300);
  };

  const sidebarContent = (
    <aside className="w-52 h-full bg-[#1E1B4B] flex flex-col">
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="text-white font-semibold text-base leading-tight">
          My Task App
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <NavLink
          to="/"
          end
          onClick={() => {
            setActiveMenu(null);
            onClose?.();
          }}
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

        <button
          type="button"
          onClick={handleCreateTask}
          className={menuBtnCls('create-task')}>
          <Plus size={16} />
          Create Task
        </button>
      </nav>

      <div className="px-2 pb-4 border-t border-white/10 pt-3">
        <Button
          onClick={() => logout()}
          disabled={isPending}
          size="md"
          className="w-full flex items-center gap-3 px-3 py-3.5 text-white text-xs rounded-lg transition-all duration-150 cursor-pointer"
          variant="danger">
          <LogOut size={14} />
          {isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: sidebar statis */}
      <div className="hidden lg:flex shrink-0 min-h-screen">
        {sidebarContent}
      </div>

      {/* Mobile/Tablet: overlay drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
