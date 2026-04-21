import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_CATEGORIES } from '../mock-data';
import { ProductCard } from '../components/ui/ProductCard';
import { SellerCard } from '../components/ui/SellerCard';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { NotifyMeSheet } from '../components/ui/NotifyMeSheet';
import { Product } from '../types';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'products' | 'sellers'>('products');
  const [selectedCat, setSelectedCat] = useState('cat1');
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    
    if (tab === 'products') {
      let items = MOCK_PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
      if (selectedCat !== 'cat1') {
        items = items.filter(p => p.categoryId === selectedCat);
      }
      return items;
    } else {
      return MOCK_SELLERS.filter(s => 
        s.displayName.toLowerCase().includes(q) || 
        s.username.toLowerCase().includes(q)
      );
    }
  }, [query, tab, selectedCat]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12 pt-8">
      {/* Search Header Area */}
      <div className="sticky top-20 bg-white pt-2 pb-6 z-40 space-y-8">
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, sellers, categories..."
            className="w-full bg-white border-2 border-zinc-100 rounded-[2rem] pl-16 pr-6 py-5 text-xl font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-zinc-300 shadow-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-zinc-100">
            <button
              onClick={() => setTab('products')}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                tab === 'products' ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Products ({MOCK_PRODUCTS.length})
              {tab === 'products' && (
                <motion.div layoutId="activeSearchTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setTab('sellers')}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                tab === 'sellers' ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Sellers ({MOCK_SELLERS.length})
              {tab === 'sellers' && (
                <motion.div layoutId="activeSearchTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Filter Trigger / Counter */}
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{results.length} results matching "{query || 'everything'}"</span>
             <button className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-indigo-600 transition-all shadow-sm">
               <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Categories (only for products) */}
        {tab === 'products' && (
          <div className="pt-2">
            <CategoryFilter 
              categories={MOCK_CATEGORIES}
              selectedId={selectedCat}
              onSelect={setSelectedCat}
            />
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {results.length > 0 ? (
          <div 
            className={tab === 'products' ? "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}
          >
            {tab === 'products' ? (
              (results as any[]).map((p) => (
                <ProductCard 
                  key={p.id}
                  product={p} 
                  onNotifyMe={setNotifyProduct}
                />
              ))
            ) : (
              (results as any[]).map((s) => (
                <SellerCard key={s.id} seller={s} />
              ))
            )}
          </div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-[2rem] border border-zinc-100 flex items-center justify-center text-5xl shadow-sm filter grayscale opacity-20">
              🔍
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">No results found</h3>
              <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto leading-relaxed">
                We couldn't find anything matching your search. Try broadening your keywords.
              </p>
            </div>
            <button 
              onClick={() => {setQuery(''); setSelectedCat('cat1');}}
              className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Clear Filters
            </button>
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
