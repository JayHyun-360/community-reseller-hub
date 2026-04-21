import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-900/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-zinc-900/5 blur-3xl rounded-full" />

        <div className="relative text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-50 text-zinc-900 rounded-full mb-6 border border-zinc-100 shadow-md">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-zinc-900">Start discovery smarter</h1>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Share your portfolio with one link.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative">
          <div className="flex p-1 bg-zinc-50 border border-zinc-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider ${
                method === 'email' ? 'bg-white text-zinc-900 shadow-lg border border-zinc-100' : 'text-zinc-400 hover:text-zinc-500'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider ${
                method === 'phone' ? 'bg-white text-zinc-900 shadow-lg border border-zinc-100' : 'text-zinc-400 hover:text-zinc-500'
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </div>

          <div className="space-y-2">
            <input
              required
              type={method === 'email' ? 'email' : 'tel'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={method === 'email' ? 'charldul@nearbyt.com' : '0917 000 0000'}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300 font-medium"
            />
          </div>

          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            className="bg-zinc-900 text-white rounded-full py-6 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 shadow-xl shadow-zinc-200"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : `Enter Nearby`}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>

        <div className="mt-12 text-center relative border-t border-zinc-100 pt-8">
          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-4">Connecting your neighborhood</p>
          <div className="flex justify-center -space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/nearby-user${i}/100`} 
                alt="Seller" 
                className="w-10 h-10 rounded-full border-4 border-white grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm" 
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
