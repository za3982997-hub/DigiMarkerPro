
import React, { useState } from 'react';

export type ViewType = 'catalog' | 'library' | 'dashboard' | 'admin';

interface NavbarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenAI: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeView,
  onViewChange,
  onOpenCart, 
  cartCount, 
  onOpenWishlist, 
  wishlistCount, 
  onOpenAI, 
  onOpenLogin,
  isLoggedIn,
  onLogout,
  searchQuery, 
  setSearchQuery 
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={() => onViewChange('catalog')}
            className="flex items-center space-x-2 focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">D</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hidden md:block">
              DigiMarket
            </span>
          </button>

          <div className={`flex-1 max-w-md mx-4 transition-all duration-300 ${isMobileSearchOpen ? 'flex absolute inset-x-0 top-0 h-20 bg-white px-4 items-center z-50 md:relative md:bg-transparent md:px-0 md:flex' : 'hidden md:flex'}`}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari aset digital premium..."
                className="w-full bg-slate-100 border-2 border-transparent rounded-full py-2.5 px-11 focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium text-slate-700"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
            <button 
              onClick={() => onViewChange('admin')}
              className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-full transition-all border font-bold text-sm mr-2 ${
                activeView === 'admin' 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              <i className="fa-solid fa-lock-open"></i>
              <span>Panel Admin</span>
            </button>
            
            <button 
              onClick={onOpenAI}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 mr-2"
            >
              <i className="fa-solid fa-robot"></i>
              <span className="font-semibold text-sm">Tanya AI</span>
            </button>
            
            <button 
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
              title="Wishlist"
            >
              <i className="fa-regular fa-heart text-xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              title="Keranjang"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center">
                <div 
                  onClick={() => onViewChange('dashboard')}
                  className={`w-10 h-10 ml-2 rounded-full flex items-center justify-center cursor-pointer transition-colors border ${
                    activeView === 'dashboard' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Dasbor"
                >
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
                <button 
                  onClick={onLogout}
                  className="ml-2 p-2.5 text-slate-400 hover:text-rose-500 transition-colors hidden sm:block"
                  title="Keluar"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="ml-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-black transition-all shadow-md shadow-slate-200"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
