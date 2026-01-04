
import React from 'react';
import { Product } from '../types';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: string) => void;
  onMoveToCart: (product: Product) => void;
}

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({ isOpen, onClose, items, onRemove, onMoveToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-slide-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-heart text-rose-500"></i>
            <h2 className="text-xl font-bold text-slate-900">Wishlist</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-regular fa-heart text-rose-300 text-2xl"></i>
              </div>
              <p className="text-slate-500 font-medium">Wishlist Anda kosong.</p>
              <p className="text-slate-400 text-sm mt-1">Simpan item yang Anda minati untuk nanti.</p>
              <button onClick={onClose} className="mt-6 text-indigo-600 font-medium hover:underline">
                Jelajahi katalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex space-x-4 group">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full rounded-xl object-cover" />
                  <div className="absolute top-1 left-1">
                    <span className="bg-white/90 backdrop-blur-sm text-[8px] px-1.5 py-0.5 rounded font-bold text-indigo-600 uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-0.5 line-clamp-1">{item.name}</h4>
                    <p className="text-indigo-600 font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      onClick={() => onMoveToCart(item)}
                      className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center"
                    >
                      <i className="fa-solid fa-cart-plus mr-1.5"></i>
                      Tambah
                    </button>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Lanjutkan Belanja
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;
