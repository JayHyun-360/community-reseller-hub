import React from 'react';
import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-50 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={onMenuClick}
            className="p-2 text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-md">
              <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
            </div>
            <span className="font-black text-xl tracking-tighter text-zinc-900">
              NearByt
            </span>
          </Link>
        </div>

        {/* Global Desktop Search Input (Enhanced Pinterest feel) */}
        <div className="hidden lg:block flex-grow max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search local finds..." 
              className="w-full bg-zinc-100 border-none rounded-full py-3.5 pl-14 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:bg-zinc-200 transition-all"
              onFocus={() => navigate('/search')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all relative">
            <Bell className="w-6 h-6" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
          
          <div className="hidden lg:block h-6 w-px bg-zinc-100 mx-2" />

          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 rounded-full transition-all group"
          >
            <img 
              src="https://picsum.photos/seed/user-jess/100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:border-zinc-200 transition-all" 
            />
            <div className="hidden xl:block text-left mr-2">
              <div className="text-[11px] font-black tracking-tight text-zinc-900 leading-none">Ate Jess</div>
              <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Elite Reseller</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
