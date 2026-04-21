import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Camera, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../mock-data';
import { ProductCard } from '../components/ui/ProductCard';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stockQty: '1',
    categoryId: 'cat2',
    isFeatured: false
  });

  const previewProduct = {
    id: 'preview',
    sellerId: 's1',
    categoryId: formData.categoryId,
    title: formData.title || 'Product Title Preview',
    description: formData.description,
    price: Number(formData.price) || 0,
    images: ['https://picsum.photos/seed/preview/800/800'],
    stockQty: Number(formData.stockQty),
    status: Number(formData.stockQty) === 0 ? 'sold_out' : Number(formData.stockQty) <= 3 ? 'low' : 'available',
    isFeatured: formData.isFeatured,
    viewCount: 0,
    createdAt: new Date().toISOString()
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12 pt-4">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-dim hover:text-text-main transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form Part */}
        <div className="lg:col-span-3 space-y-8">
          <header>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-sm text-text-muted">Fill in the details to list your item.</p>
          </header>

          <div className="space-y-6">
            {/* Image Upload Area */}
            <div className="aspect-video md:aspect-[3/1] bg-bg-card border-2 border-dashed border-border-main rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-text-dim transition-all group">
              <div className="w-12 h-12 bg-bg-surface rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-text-dim" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload product images</p>
                <p className="text-xs text-text-muted mt-1">Supports PNG, JPG (Max 5MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest pl-1">Product Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Handmade Sanrio Keychain"
                  className="w-full bg-bg-card border border-border-main rounded-xl px-4 py-3 text-sm focus:border-neon-purple outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest pl-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="w-full bg-bg-card border border-border-main rounded-xl px-4 py-3 text-sm focus:border-neon-purple outline-none transition-all appearance-none"
                  >
                    {MOCK_CATEGORIES.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-dim uppercase tracking-widest pl-1">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Tell buyers about your item..."
                className="w-full bg-bg-card border border-border-main rounded-xl px-4 py-3 text-sm focus:border-neon-purple outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest pl-1">Price (₱)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-bg-card border border-border-main rounded-xl px-4 py-3 text-sm focus:border-neon-purple outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest pl-1">Initial Stock</label>
                <input 
                  type="number" 
                  value={formData.stockQty}
                  onChange={(e) => setFormData({...formData, stockQty: e.target.value})}
                  className="w-full bg-bg-card border border-border-main rounded-xl px-4 py-3 text-sm focus:border-neon-purple outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-5 h-5 rounded-md border-border-main bg-bg-surface text-neon-purple focus:ring-neon-purple transition-all"
              />
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Feature this product in your shop hero</label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border-main">
            <Button variant="outline" className="flex-1">Save as Draft</Button>
            <Button className="flex-1 neon-glow-purple" onClick={() => navigate('/dashboard')}>Publish Listing</Button>
          </div>
        </div>

        {/* Preview Part */}
        <div className="lg:col-span-2 space-y-6">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono font-bold text-text-dim uppercase tracking-widest">Live Preview</h2>
              <span className="text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full border border-neon-green/20">Syncing...</span>
            </div>
            
            <div className="max-w-[300px] mx-auto">
              <ProductCard 
                product={previewProduct as any}
                onNotifyMe={() => {}}
                showSeller={true}
              />
            </div>

            <div className="mt-12 bg-bg-surface border border-border-main rounded-3xl p-6 text-center space-y-4">
              <p className="text-xs text-text-muted leading-relaxed">
                "Double-check your price and stock quantity. Buyers will see updates in real-time."
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-neon-purple/30" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
