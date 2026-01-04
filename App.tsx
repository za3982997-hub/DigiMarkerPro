
import React, { useState, useMemo, useEffect } from 'react';
import Navbar, { ViewType } from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import WishlistSidebar from './components/WishlistSidebar';
import CheckoutModal from './components/CheckoutModal';
import AIConsultant from './components/AIConsultant';
import ReviewModal from './components/ReviewModal';
import ProductDetails from './components/ProductDetails';
import MyLibraryView from './components/MyLibraryView';
import DashboardView from './components/DashboardView';
import CoursePlayer from './components/CoursePlayer';
import AdminView from './components/AdminView';
import LoginModal from './components/LoginModal';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Review, CourseProgress } from './types';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

const INITIAL_REVIEWS: Review[] = [
  { 
    id: 'r1', 
    productId: 'c-1', 
    userName: 'Alex Johnson', 
    rating: 5, 
    comment: 'Kursus React ini mengubah karir saya. Bagian TypeScript sangat berharga! Saya mendapat pekerjaan senior setelah menyelesaikannya.', 
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-on-a-monitor-screen-1729-large.mp4' 
  },
  { 
    id: 'r2', 
    productId: 'c-1', 
    userName: 'Sarah Miller', 
    rating: 4, 
    comment: 'Sangat mendalam dan teknis. Tepat seperti yang saya butuhkan untuk pekerjaan di perusahaan besar.', 
    date: new Date(Date.now() - 86400000 * 2).toISOString() 
  },
  { 
    id: 'r3', 
    productId: 'c-2', 
    userName: 'Kevin Chen', 
    rating: 5, 
    comment: 'Akhirnya ada kursus AI yang benar-benar membangun proyek nyata, bukan hanya teori! Proyek LLM-nya luar biasa.', 
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-white-robot-arm-holding-a-glass-sphere-43224-large.mp4'
  },
  { 
    id: 'r4', 
    productId: 'c-3', 
    userName: 'Budi Hartono', 
    rating: 5, 
    comment: 'UI/UX paling komplit! Figma filenya sangat membantu untuk portofolio saya.', 
    date: new Date(Date.now() - 86400000 * 1).toISOString() 
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType | 'admin'>('catalog');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [purchasedItems, setPurchasedItems] = useState<Product[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, string[]>>({});
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);
  const [isCartCheckout, setIsCartCheckout] = useState(false);

  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem('digimarket_inventory');
    const savedReviews = localStorage.getItem('digimarket_reviews');
    const savedPurchases = localStorage.getItem('digimarket_purchases');
    const savedProgress = localStorage.getItem('digimarket_progress');
    const savedAuth = localStorage.getItem('digimarket_auth');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedPurchases) setPurchasedItems(JSON.parse(savedPurchases));
    if (savedProgress) setCourseProgress(JSON.parse(savedProgress));
    if (savedAuth) setIsLoggedIn(JSON.parse(savedAuth));
  }, []);

  useEffect(() => localStorage.setItem('digimarket_inventory', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('digimarket_reviews', JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem('digimarket_purchases', JSON.stringify(purchasedItems)), [purchasedItems]);
  useEffect(() => localStorage.setItem('digimarket_progress', JSON.stringify(courseProgress)), [courseProgress]);
  useEffect(() => localStorage.setItem('digimarket_auth', JSON.stringify(isLoggedIn)), [isLoggedIn]);

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === updated.id);
      if (exists) return prev.map(p => p.id === updated.id ? updated : p);
      return [updated, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateReview = (updated: Review) => {
    setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    const itemsToPurchase = checkoutItems?.map(item => {
      const { quantity, ...product } = item;
      return product;
    }) || [];

    setPurchasedItems(prev => {
      const newItems = itemsToPurchase.filter(item => !prev.some(p => p.id === item.id));
      return [...prev, ...newItems];
    });

    if (isCartCheckout) setCart([]);
    setCheckoutItems(null);
    setIsCartCheckout(false);
    setIsCartOpen(false);
    setActiveView('library');
  };

  const handleToggleModule = (productId: string, moduleName: string) => {
    setCourseProgress(prev => {
      const current = prev[productId] || [];
      const updated = current.includes(moduleName)
        ? current.filter(m => m !== moduleName)
        : [...current, moduleName];
      return { ...prev, [productId]: updated };
    });
  };

  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setCheckoutItems([{ ...product, quantity: 1 }]);
    setIsCartCheckout(false);
  };

  const handleCartCheckout = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setCheckoutItems(cart);
    setIsCartCheckout(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleAddFromAI = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) addToCart(prod);
  };

  const addReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setReviews(prev => [...prev, review]);
  };

  const getProductStats = (productId: string, mockRating: number, mockCount: number) => {
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) return { rating: mockRating, count: mockCount };
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0) + (mockRating * mockCount);
    const totalCount = productReviews.length + mockCount;
    return { rating: totalRating / totalCount, count: totalCount };
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products].filter(p => {
      const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => {
        const statsA = getProductStats(a.id, a.rating, a.reviews);
        const statsB = getProductStats(b.id, b.rating, b.reviews);
        return statsB.rating - statsA.rating;
      }); break;
      default: break;
    }
    return result;
  }, [activeCategory, searchQuery, sortBy, reviews, products]);

  const renderContent = () => {
    if (activeView === 'admin') {
      return (
        <AdminView 
          products={products} 
          onUpdateProduct={handleUpdateProduct} 
          onDeleteProduct={handleDeleteProduct} 
          onExit={() => setActiveView('catalog')} 
          reviews={reviews}
          onUpdateReview={handleUpdateReview}
          onDeleteReview={handleDeleteReview}
        />
      );
    }

    if (activeCourseId) {
      const course = purchasedItems.find(p => p.id === activeCourseId);
      if (course) {
        return (
          <CoursePlayer 
            product={course} 
            completedModules={courseProgress[course.id] || []}
            onToggleModule={(mod) => handleToggleModule(course.id, mod)}
            onBack={() => setActiveCourseId(null)}
          />
        );
      }
    }

    if (selectedProductForDetails) {
      return (
        <ProductDetails 
          product={selectedProductForDetails}
          reviews={reviews.filter(r => r.productId === selectedProductForDetails.id)}
          isWishlisted={wishlist.some(item => item.id === selectedProductForDetails.id)}
          onClose={() => setSelectedProductForDetails(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onBuyNow={handleBuyNow}
          onAddReview={addReview}
          averageRating={getProductStats(selectedProductForDetails.id, selectedProductForDetails.rating, selectedProductForDetails.reviews).rating}
          totalReviews={getProductStats(selectedProductForDetails.id, selectedProductForDetails.rating, selectedProductForDetails.reviews).count}
        />
      );
    }

    switch (activeView) {
      case 'catalog':
        return (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar flex-1">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-bold text-sm ${
                          activeCategory === cat 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                          : 'bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Urutkan</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="featured">Unggulan</option>
                      <option value="price-low">Harga Terendah</option>
                      <option value="price-high">Harga Tertinggi</option>
                      <option value="rating">Rating Tertinggi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8 animate-fade-in-right">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {activeCategory === 'Semua' ? 'Katalog Kami' : activeCategory}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {filteredProducts.length} produk digital premium ditemukan
                  </p>
                </div>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map((product, index) => {
                    const stats = getProductStats(product.id, product.rating, product.reviews);
                    const staggerIndex = index % 4; 
                    return (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        isWishlisted={wishlist.some(item => item.id === product.id)}
                        onAddToCart={addToCart} 
                        onToggleWishlist={toggleWishlist}
                        onViewReviews={(p) => setSelectedProductForReview(p)}
                        onBuyNow={handleBuyNow}
                        onViewDetails={(p) => setSelectedProductForDetails(p)}
                        reviewCount={stats.count}
                        averageRating={stats.rating}
                        style={{ animationDelay: `${staggerIndex * 0.1}s` }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 animate-fade-in">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-filter-circle-xmark text-4xl text-slate-300"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Tidak ada produk yang cocok</h3>
                  <button onClick={() => {setActiveCategory('Semua'); setSearchQuery('');}} className="mt-8 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Reset Semua Filter</button>
                </div>
              )}
            </div>
          </>
        );
      case 'library':
        return <MyLibraryView purchasedItems={purchasedItems} courseProgress={courseProgress} onAccess={(id) => setActiveCourseId(id)} onExplore={() => setActiveView('catalog')} />;
      case 'dashboard':
        return (
          <DashboardView 
            purchasedCount={purchasedItems.length} 
            wishlistCount={wishlist.length} 
            onExplore={() => setActiveView('catalog')} 
            onViewLibrary={() => setActiveView('library')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        activeView={activeView as ViewType}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedProductForDetails(null);
          setActiveCourseId(null);
        }}
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setActiveView('catalog');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="flex-1 pb-20">{renderContent()}</main>
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 text-white mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">D</div>
                <span className="text-2xl font-bold tracking-tight">DigiMarket<span className="text-indigo-500">.</span></span>
              </div>
              <p className="max-w-sm mb-8 text-slate-400 leading-relaxed">Destinasi terkemuka di dunia untuk aset digital premium, kursus, dan sumber daya yang dikurasi oleh para ahli industri.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Perpustakaan Kursus</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Perangkat Lunak Digital</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Dukungan</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Kontak Ahli</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Bantuan Tagihan</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={handleCartCheckout} />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={wishlist} onRemove={removeFromWishlist} onMoveToCart={moveWishlistToCart} />
      <CheckoutModal isOpen={!!checkoutItems} onClose={() => setCheckoutItems(null)} items={checkoutItems || []} onSuccess={handleCheckoutSuccess} />
      <AIConsultant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} productCatalog={products} onAddFromAI={handleAddFromAI} />
      <ReviewModal isOpen={!!selectedProductForReview} onClose={() => setSelectedProductForReview(null)} product={selectedProductForReview} reviews={reviews.filter(r => r.productId === selectedProductForReview?.id)} onAddReview={addReview} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={() => setIsLoggedIn(true)} 
      />
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[100] w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-200 flex items-center justify-center transition-all duration-300 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        } hover:bg-indigo-700 hover:-translate-y-1 active:scale-95`}
        title="Kembali ke Atas"
      >
        <i className="fa-solid fa-arrow-up text-xl"></i>
      </button>
    </div>
  );
};

export default App;
