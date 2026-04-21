import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SELLERS, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../mock-data';
import { Product } from '../types';
import { ProductCard } from '../components/ui/ProductCard';
import { TrustBadge } from '../components/ui/TrustBadge';
import { Button } from '../components/ui/Button';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { NotifyMeSheet } from '../components/ui/NotifyMeSheet';
import { motion } from 'motion/react';
import { Share2, MessageCircle, Phone as WhatsApp } from 'lucide-react';

export const Storefront: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('cat1');
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);

  const seller = MOCK_SELLERS.find(s => s.username === username) || MOCK_SELLERS[0];
  const products = MOCK_PRODUCTS.filter(p => p.sellerId === seller.id);
  const filteredProducts = selectedCat === 'cat1' 
    ? products 
    : products.filter(p => p.categoryId === selectedCat);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-12 min-h-screen bg-white">
      {/* Profile Header */}
      <div className="relative pt-12 px-4">
        <div className="bento-card overflow-hidden">
          <div className="h-40 md:h-56 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 flex flex-wrap gap-4 p-4 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-lg bg-white/20 border border-white/10" />
              ))}
            </div>
            <h2 className="text-6xl font-black text-white/10 tracking-tighter uppercase whitespace-nowrap select-none">
              {seller.displayName}
            </h2>
          </div>
          
          <div className="px-6 -mt-16 md:-mt-20 flex flex-col items-center text-center pb-8">
            <div className="relative group">
              <img 
                src={seller.avatarUrl} 
                alt={seller.displayName} 
                className={`w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 ${
                  seller.trustTier === 'elite' ? 'border-amber-400' : 'border-white'
                } object-cover shadow-2xl transition-transform group-hover:scale-105`}
              />
              {seller.idVerified && (
                <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-2xl border-4 border-white shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"/></svg>
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">{seller.displayName}</h1>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest italic">@{seller.username}</p>
              <div className="flex justify-center mt-4">
                <TrustBadge tier={seller.trustTier} />
              </div>
            </div>

            <p className="mt-8 text-base text-zinc-500 max-w-lg leading-relaxed font-medium">
              {seller.bio}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 w-full max-w-md">
              <Button 
                fullWidth 
                size="lg"
                leftIcon={<MessageCircle className="w-5 h-5" />}
                className="bg-[#0084FF] text-white hover:bg-[#0084FF]/90 rounded-3xl"
                onClick={() => window.open(seller.messengerUrl, '_blank')}
              >
                Message on Messenger
              </Button>
              {seller.whatsappNum && (
                <Button 
                  fullWidth 
                  size="lg"
                  variant="outline"
                  leftIcon={<WhatsApp className="w-5 h-5 text-[#25D366]" />}
                  className="rounded-3xl border-zinc-200 text-zinc-600"
                  onClick={() => window.open(`https://wa.me/${seller.whatsappNum}`, '_blank')}
                >
                  Chat on WhatsApp
                </Button>
              )}
            </div>

            {/* Stats Strip */}
            <div className="mt-12 grid grid-cols-3 gap-1 w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50">
              <div className="bg-white p-6">
                <div className="text-2xl font-black text-zinc-900">{products.length}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Products</div>
              </div>
              <div className="bg-white p-6 border-x border-zinc-100">
                <div className="text-2xl font-black text-indigo-600">{seller.trustScore}%</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Trust Score</div>
              </div>
              <div className="bg-white p-6">
                <div className="text-2xl font-black text-zinc-900">{seller.tradesCount}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Trades</div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="absolute top-16 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/20 transition-all shadow-xl"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Product Feed */}
      <div className="mt-16 px-4">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900">Inventory</h2>
        </div>
        
        <div className="px-4 mb-8">
          <CategoryFilter 
            categories={MOCK_CATEGORIES}
            selectedId={selectedCat}
            onSelect={setSelectedCat}
          />
        </div>

        {/* Masonry Product Feed */}
        <div className="columns-2 md:columns-3 gap-6 px-4">
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onNotifyMe={setNotifyProduct}
              showSeller={false}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 bento-card border-dashed text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
            No products found in this category...
          </div>
        )}
      </div>

      <NotifyMeSheet 
        product={notifyProduct}
        isOpen={!!notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />
    </div>
  );
};
