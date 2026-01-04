
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ProductDetailsProps {
  product: Product;
  reviews: Review[];
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  averageRating: number;
  totalReviews: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  reviews,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onBuyNow,
  onAddReview,
  averageRating,
  totalReviews
}) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddReview({
        productId: product.id,
        userName: 'Siswa Terverifikasi',
        rating: newRating,
        comment: newComment.trim(),
        videoUrl: newVideoUrl.trim() || undefined
      });
      setNewComment('');
      setNewRating(5);
      setNewVideoUrl('');
    }
  };

  const renderFormattedDescription = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        let processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em class="italic text-indigo-600">$1</em>')
          .replace(/^- (.*)/g, '<li>$1</li>');
        
        if (processed.startsWith('<li>')) {
          return <ul key={i} className="list-disc ml-6 my-2 text-slate-600"><span dangerouslySetInnerHTML={{ __html: processed }} /></ul>;
        }
        return <p key={i} className="mb-4 min-h-[1.2em] leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: processed }} />;
      });
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
  }));

  const getAvatarGradient = (name: string) => {
    const colors = [
      'from-indigo-500 to-violet-500',
      'from-rose-500 to-orange-500',
      'from-emerald-500 to-teal-500',
      'from-amber-400 to-orange-600',
      'from-cyan-500 to-blue-500'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button 
        onClick={onClose}
        className="flex items-center text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors group"
      >
        <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
        Kembali ke Katalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gambar Produk */}
        <div className="relative aspect-video lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6">
            <span className="glass px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg border border-white/40 text-indigo-700">
              {product.category}
            </span>
          </div>
        </div>

        {/* Info Produk */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              {product.name}
            </h1>
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`p-5 rounded-3xl transition-all shadow-xl border-2 ${
                isWishlisted 
                  ? 'bg-rose-50 border-rose-100 text-rose-500 scale-110' 
                  : 'bg-white border-slate-50 text-slate-300 hover:text-rose-500 hover:border-rose-100'
              }`}
            >
              <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-2xl`}></i>
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center bg-amber-50 px-4 py-2 rounded-2xl text-amber-600 font-black border border-amber-100 shadow-sm">
              <i className="fa-solid fa-star mr-2"></i>
              <span className="text-xl">{averageRating.toFixed(1)}</span>
              <span className="text-amber-400 font-medium ml-2 text-sm">/ 5.0</span>
            </div>
            {product.instructor && (
              <div className="flex items-center text-slate-500 border-l border-slate-200 pl-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-3 text-indigo-600">
                   <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instruktur</p>
                  <span className="font-bold text-slate-700">{product.instructor}</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-xl leading-relaxed mb-10 font-medium">
            {renderFormattedDescription(product.description)}
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-8 mb-8 shadow-xl shadow-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Investasi</span>
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">Rp {product.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 mb-2">Akses Instan</span>
                <span className="text-slate-400 text-xs font-medium">Sekali bayar</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="py-5 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center space-x-3 text-sm"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Tambah ke Keranjang</span>
              </button>
              <button 
                onClick={() => onBuyNow(product)}
                className="py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center space-x-3 text-sm"
              >
                <span>Daftar Sekarang</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em]">Keuntungan Termasuk</h3>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature, idx) => (
                <div key={idx} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center border border-indigo-100/50">
                  <i className="fa-solid fa-check-circle mr-2 text-[10px]"></i>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Kurikulum */}
      {product.category === 'Kursus' && product.modules && (
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Roadmap Kurikulum
            </h2>
            <span className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {product.modules.length} Modul
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.modules.map((module, index) => (
              <div key={index} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center hover:border-indigo-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-lg mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <span className="font-bold text-slate-700">{module}</span>
                <div className="ml-auto text-slate-200 group-hover:text-indigo-200 transition-colors">
                  <i className="fa-solid fa-circle-play text-xl"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BAGIAN FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Punya Pertanyaan?</h2>
            <p className="text-slate-500 font-medium">Segala hal yang perlu Anda ketahui tentang produk digital ini.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {product.faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-800 pr-8">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 bg-indigo-600 text-white' : ''}`}>
                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                  </div>
                </button>
                <div className={`transition-all duration-500 overflow-hidden ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-8 pb-8 text-slate-500 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WALL OF LOVE (TEMBOK CINTA) */}
      <div className="border-t border-slate-100 pt-24 pb-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <i className="fa-solid fa-heart-pulse"></i>
            <span>Tembok Cinta</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 text-center">Cerita Sukses Digital</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-center">Siswa nyata berbagi hasil nyata dari konten premium DigiMarket.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Poster Statistik Ulasan */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl group-hover:rotate-12 transition-transform duration-700">
                 <i className="fa-solid fa-quote-right"></i>
               </div>
               
               <div className="relative z-10 text-center">
                 <h3 className="text-6xl font-black mb-2 tracking-tighter">{averageRating.toFixed(1)}</h3>
                 <div className="flex justify-center text-amber-400 text-xl mb-4">
                   {[1, 2, 3, 4, 5].map((s) => (
                     <i key={s} className={`${s <= Math.round(averageRating) ? 'fa-solid' : 'fa-regular'} fa-star mx-0.5`}></i>
                   ))}
                 </div>
                 <p className="text-indigo-100 font-bold uppercase tracking-[0.2em] text-[10px] mb-10">Berdasarkan {totalReviews} Cerita Siswa</p>

                 <div className="space-y-4 text-left">
                   {ratingCounts.map((rc) => (
                     <div key={rc.stars} className="flex items-center space-x-4">
                       <span className="text-[10px] font-black w-4">{rc.stars}</span>
                       <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                           style={{ width: `${rc.percentage}%` }}
                         ></div>
                       </div>
                       <span className="text-[10px] font-bold text-indigo-200 w-8">{rc.percentage.toFixed(0)}%</span>
                     </div>
                   ))}
                 </div>

                 <div className="mt-12 pt-10 border-t border-white/10">
                    <button 
                      onClick={() => document.getElementById('reviewForm')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl active:scale-95"
                    >
                      Bagikan Cerita Saya
                    </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Grid Poster Ulasan */}
          <div className="lg:col-span-8 space-y-10">
            {reviews.length === 0 ? (
              <div className="text-center py-32 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-100">
                <i className="fa-solid fa-comments text-slate-200 text-6xl mb-6"></i>
                <p className="text-slate-400 font-black text-xl">Belum ada suara siswa.</p>
                <p className="text-slate-400 text-sm mt-2">Jadilah pionir dan beri inspirasi kepada calon pelajar lainnya!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...reviews].reverse().map((review, idx) => (
                  <div key={review.id} className={`review-poster relative bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col group hover:-translate-y-3 transition-all duration-500 ${review.videoUrl ? 'md:col-span-1' : ''}`}>
                    {review.videoUrl ? (
                      <div className="relative aspect-video w-full bg-slate-900 group-hover:brightness-110 transition-all">
                        <video 
                          src={review.videoUrl} 
                          className="w-full h-full object-cover opacity-80" 
                          muted 
                          onMouseOver={(e) => e.currentTarget.play()} 
                          onMouseOut={(e) => e.currentTarget.pause()} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end p-6">
                           <div className="flex items-center space-x-2 text-white bg-indigo-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg">
                              <i className="fa-solid fa-play animate-pulse"></i>
                              <span>Pengalaman Video</span>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-4 bg-indigo-500 w-full"></div>
                    )}
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-lg text-white shadow-md bg-gradient-to-br ${getAvatarGradient(review.userName)}`}>
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{review.userName}</p>
                          <div className="flex items-center mt-1 space-x-2">
                             <div className="flex text-amber-400 text-[10px]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <i key={s} className={`${s <= review.rating ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                              ))}
                            </div>
                             <span className="text-[10px] font-bold text-slate-300">
                               {new Date(review.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 relative">
                        <p className="relative z-10 text-slate-700 leading-relaxed font-medium italic text-sm py-2">
                          "{review.comment}"
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Terverifikasi DigiMarket</span>
                        <div className="flex space-x-2">
                          <i className="fa-solid fa-thumbs-up text-slate-300 hover:text-indigo-500 cursor-pointer transition-colors"></i>
                          <i className="fa-solid fa-share-nodes text-slate-300 hover:text-indigo-500 cursor-pointer transition-colors"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Poster Form Ulasan */}
            <div id="reviewForm" className="mt-16 bg-slate-900 rounded-[40px] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-[140px] opacity-20 -mr-40 -mt-40 group-hover:opacity-30 transition-opacity duration-1000"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500 rounded-full blur-[140px] opacity-10 -ml-40 -mb-40 group-hover:opacity-20 transition-opacity duration-1000"></div>
               
               <div className="relative z-10">
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                   <div>
                     <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">Jadi Siswa Unggulan</h3>
                     <p className="text-slate-400 text-sm font-medium">Cerita Anda memberdayakan 1.000+ siswa lainnya. Sertakan video untuk dampak maksimal!</p>
                   </div>
                   <div className="mt-6 md:mt-0 flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              star <= newRating ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            <i className="fa-solid fa-star text-sm"></i>
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>
                 
                 <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Testimoni Saya</label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Apa yang Anda capai? Bagikan hasil Anda..."
                          className="w-full bg-slate-800/50 border-2 border-slate-700 focus:border-indigo-500 rounded-[32px] p-8 text-sm focus:ring-0 min-h-[160px] outline-none transition-all placeholder-slate-600 text-slate-200 backdrop-blur-sm"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Tautan Video (MP4/YT)</label>
                        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-[32px] p-6 h-full flex flex-col justify-between">
                          <input 
                            type="text" 
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            className="w-full bg-transparent border-b border-slate-700 py-2 text-xs focus:border-indigo-500 outline-none transition-colors text-indigo-400 font-mono"
                            placeholder="https://..."
                          />
                          <div className="mt-6 flex flex-col items-center text-center">
                             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${newVideoUrl ? 'bg-indigo-600 animate-bounce' : 'bg-slate-700 opacity-30'}`}>
                                <i className="fa-solid fa-video-camera text-2xl"></i>
                             </div>
                             <p className="text-[10px] text-slate-500 font-bold">Lampirkan video agar muncul di Tembok Cinta!</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                      <p className="text-[10px] text-slate-500 font-bold max-w-xs text-center sm:text-left">
                        Dengan mempublikasikan, Anda menginspirasi generasi pencipta digital berikutnya.
                      </p>
                      <button 
                        type="submit"
                        className="w-full sm:w-auto px-16 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50 flex items-center justify-center space-x-3 active:scale-95"
                      >
                        <span>Publikasikan Cerita Sukses</span>
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                 </form>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
