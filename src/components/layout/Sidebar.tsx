import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Search, LayoutDashboard, LogIn, Github, X, Compass, Heart, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Compass, label: 'Explore' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Shop Manager' },
    { to: '/login', icon: LogIn, label: 'Account' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Brand */}
      <div className="mb-10 flex items-center justify-between">
        <Link to="/" onClick={onClose} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="font-black text-2xl tracking-tighter text-zinc-900">
            NearByt
          </span>
        </Link>
        <button onClick={onClose} className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-300 font-bold ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[13px] tracking-wide">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Card */}
      <div className="mt-auto space-y-6">
        <div className="p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 relative overflow-hidden group">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Community Hub</div>
          <h4 className="text-sm font-black text-zinc-900 mb-4 leading-tight">Support local resellers nearby.</h4>
          <button className="w-full py-3 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-md">
            Join Us
          </button>
        </div>

        <div className="flex items-center justify-between px-4 text-zinc-300">
          <span className="text-[10px] font-bold uppercase tracking-widest">© 2024 NearByt</span>
          <div className="flex gap-4">
            <Github className="w-4 h-4 cursor-pointer hover:text-zinc-900 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Always visible) */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-zinc-100 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-[101] shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
