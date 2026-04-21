import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_SELLERS } from '../mock-data';
import { Button } from '../components/ui/Button';
import { StockBadge } from '../components/ui/StockBadge';
import { Plus, Minus, ArrowUpRight, TrendingUp, Users, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const seller = MOCK_SELLERS[0]; // Current user mock
  const [products, setProducts] = useState(MOCK_PRODUCTS.filter(p => p.sellerId === seller.id));

  const stats = [
    { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-zinc-400' },
    { label: 'Active Listings', value: products.filter(p => p.status !== 'sold_out').length, icon: TrendingUp, color: 'text-indigo-600' },
    { label: 'Sold Out Items', value: products.filter(p => p.status === 'sold_out').length, icon: AlertCircle, color: 'text-red-500' },
    { label: 'Notify Queue', value: 28, icon: Users, color: 'text-zinc-900' },
  ];

  const updateQty = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(0, p.stockQty + delta);
        let newStatus = p.status;
        if (newQty === 0) newStatus = 'sold_out';
        else if (newQty <= 3) newStatus = 'low';
        else newStatus = 'available';
        return { ...p, stockQty: newQty, status: newStatus as any };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12 pt-12 bg-white min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pl-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Seller Dashboard</h1>
          <p className="text-zinc-500 font-medium">Manage your inventory and see demand signals.</p>
        </div>
        <Button 
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => navigate('/dashboard/products/new')}
          className="rounded-[1.5rem]"
        >
          Add New Product
        </Button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-zinc-50 border border-zinc-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black tracking-tighter text-zinc-900">{stat.value}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Quick Stock Toggle */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Live Inventory</h2>
            <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest cursor-pointer hover:underline">View History</span>
          </div>
          <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-6 p-6 hover:bg-zinc-50 transition-colors group">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 shadow-sm" />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-base text-zinc-900 truncate">{p.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-indigo-600">₱{p.price}</span>
                      <StockBadge status={p.status} qty={p.stockQty} className="scale-90 origin-left" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateQty(p.id, -1)}
                      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-red-400 hover:text-red-500 transition-all active:scale-90"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className={`w-8 text-center font-black text-lg ${p.stockQty === 0 ? 'text-red-500' : 'text-zinc-900'}`}>
                      {p.stockQty}
                    </span>
                    <button 
                      onClick={() => updateQty(p.id, 1)}
                      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demand Signals */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 px-2">Demand Signals</h2>
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">Queue Status</p>
              <div className="space-y-8">
                {[
                  { name: 'Y2K Denim Jacket', count: 18, color: 'bg-indigo-500' },
                  { name: 'Sanrio Charm', count: 12, color: 'bg-fuchsia-500' },
                  { name: 'Vintage Band Tee', count: 5, color: 'bg-amber-500' },
                ].map((signal, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold truncate pr-4">{signal.name}</span>
                      <span className="text-xl font-black">{signal.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(signal.count / 20) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full ${signal.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" fullWidth className="mt-12 border-white/20 text-white hover:bg-white/10 rounded-2xl py-6">Restock All</Button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center gap-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 transition-transform hover:rotate-12">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-zinc-900">New Subscriptions</h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                4 more buyers just subscribed to your shop updates!
              </p>
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 w-8 bg-indigo-600 rounded-full"></div>
              <div className="h-1.5 w-2 bg-zinc-100 rounded-full"></div>
              <div className="h-1.5 w-2 bg-zinc-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
