import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/tasks', label: 'My Tasks', icon: '✓' },
  { to: '/create', label: 'Create Task', icon: '+' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ onAddTask }: { onAddTask: () => void }) {
  // const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    navigate('/login');
  };

  return (
    <aside className="w-52 min-h-screen bg-[#1E1B4B] flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="text-white font-semibold text-base leading-tight">
          TaskFlow
        </div>
        <div className="text-white/40 text-xs mt-0.5">Personal Edition</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/90'
              }`
            }>
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3">
        <button
          onClick={onAddTask}
          className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-2 text-sm font-medium mb-3 transition">
          <span className="text-lg leading-none">+</span>
          New Task
        </button>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-3 py-2 text-white/40 text-xs rounded-lg hover:text-white/70 cursor-pointer transition">
            <span>?</span> Help Center
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/40 text-xs rounded-lg hover:text-white/70 hover:bg-white/5 transition">
            <span>↪</span> Logout
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 px-1">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {'test wkwk'}
            {/* {user?.name?.slice(0, 2).toUpperCase()} */}
          </div>
          <div className="min-w-0">
            <div className="text-white/80 text-xs font-medium truncate">
              {'Budi'}
              {/* {user?.name} */}
            </div>
            <div className="text-white/35 text-[10px] truncate">
              {'Budimailto@test.com'}
              {/* {user?.email} */}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
