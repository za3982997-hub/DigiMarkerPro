
import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  reviewCount: number;
  averageRating: number;
  style?: React.CSSProperties;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isWishlisted, 
  onAddToCart, 
  onToggleWishlist, 
  onViewReviews,
  onBuyNow,
  onViewDetails,
  reviewCount,
  averageRating,
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden product-card-hover flex flex-col h-full ${
        isVisible ? 'animate-fade-in-up' : 'reveal-hidden'
      }`}
      style={style}
    >
      <div 
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 left-2 transition-transform duration-300 group-hover:translate-x-1">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
              : 'bg-white/70 text-slate-600 hover:bg-white hover:text-rose-500 shadow-sm'
          }`}
          title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
        >
          <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-bold text-slate-900 line-clamp-1 flex-1 mr-2 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewReviews(product);
            }}
            className="flex items-center text-amber-500 text-sm hover:scale-110 transition-transform shrink-0"
            title="Lihat Ulasan"
          >
            <i className="fa-solid fa-star mr-1 animate-pulse"></i>
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-slate-400 text-[10px] ml-1">({reviewCount})</span>
          </button>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-2 h-10 group-hover:text-slate-600 transition-colors">
          {product.description}
        </p>

        <button 
          onClick={() => onViewDetails(product)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-4 flex items-center w-fit group/btn"
        >
          Pelajari Lebih Lanjut <i className="fa-solid fa-arrow-right ml-1 text-[10px] transform group-hover/btn:translate-x-1 transition-transform"></i>
        </button>

        {product.instructor && (
          <div className="flex items-center mb-4 text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
            <i className="fa-solid fa-chalkboard-user mr-2 text-indigo-300"></i>
            <span>{product.instructor}</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900 transition-all duration-500 group-hover:text-indigo-600 transform origin-left">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={() => onViewDetails(product)}
                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-all transform hover:scale-110"
                title="Lihat Detail"
              >
                <i className="fa-solid fa-circle-info"></i>
              </button>
              <button 
                onClick={() => onAddToCart(product)}
                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 shadow-sm"
                title="Tambah ke Keranjang"
              >
                <i className="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => onBuyNow(product)}
            className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
