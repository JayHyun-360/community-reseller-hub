import React from 'react';
import { StockStatus } from '@/src/types';
import { motion } from 'motion/react';

interface StockBadgeProps {
  status: StockStatus;
  qty: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ status, qty, className = '' }) => {
  const config = {
    available: {
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      label: '● In Stock',
      animate: true,
      dot: 'bg-indigo-600',
    },
    low: {
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      label: `⚠ ${qty} left`,
      animate: false,
      dot: '',
    },
    sold_out: {
      color: 'bg-zinc-900 text-white border-zinc-900',
      label: '✕ Sold Out',
      animate: false,
      dot: '',
    },
  }[status];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-[9px] font-bold uppercase tracking-widest shadow-sm ${config.color} ${className}`}
    >
      {config.animate && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-40`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
        </span>
      )}
      {config.label}
    </motion.div>
  );
};
