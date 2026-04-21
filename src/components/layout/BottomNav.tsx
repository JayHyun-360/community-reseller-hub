import React from 'react';
import { Home, Search, LayoutDashboard, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Manage' },
    { to: '/login', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl shadow-zinc-950/40">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1.5 p-3 rounded-full transition-all duration-300 relative ${
                isActive ? 'text-white' : 'text-zinc-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75 h-0'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
