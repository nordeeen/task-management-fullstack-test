import { CircleUserRound, Menu } from 'lucide-react';
import { Button } from './BtnCustom';
import SearchInput from './SearchInput';

interface DashboardHeaderProps {
  userName: string | undefined;
  search: string;
  onSearchChange: (value: string) => void;
  onMenuOpen: () => void;
}

export default function DashboardHeader({
  userName,
  search,
  onSearchChange,
  onMenuOpen,
}: DashboardHeaderProps) {
  return (
    <>
      <header className="bg-[#13131f] border-b border-white/6 px-4 py-3.5 flex items-center gap-3 shrink-0">
        {/* Hamburger — mobile/tablet */}
        <Button
          onClick={onMenuOpen}
          variant="secondary"
          size="icon"
          className="lg:hidden rounded-full p-1.5 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer">
          <Menu className="w-3.5 h-3.5" />
        </Button>

        {/* Search — tablet*/}
        <div className="flex-1 max-w-sm hidden sm:block">
          <SearchInput value={search} onChange={onSearchChange} />
        </div>

        {/* User info */}
        <div className="ml-auto flex items-center">
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/6">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              <CircleUserRound />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold text-gray-200 capitalize">
                {userName ?? 'User'}
              </div>
              <div className="text-xs text-gray-600">Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search — mobile only*/}
      <div className="sm:hidden px-4 py-2.5 border-b border-white/6 bg-[#13131f]">
        <SearchInput value={search} onChange={onSearchChange} className="w-full" />
      </div>
    </>
  );
}
