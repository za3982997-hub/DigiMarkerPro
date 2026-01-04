
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, product, reviews, onAddReview }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddReview({
        productId: product.id,
        userName: 'Siswa Terverifikasi',
        rating,
        comment: comment.trim(),
        videoUrl: videoUrl.trim() || undefined
      });
      setComment('');
      setVideoUrl('');
      setRating(5);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Ulasan</h2>
            <div className="flex items-center text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              <span className="text-indigo-600 mr-2">{product.name}</span>
              <span>• {reviews.length} Masukan</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-full shadow-sm border border-slate-100 transition-all">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Header Statistik Cepat */}
          <div className="flex items-center justify-between bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-indigo-200">Rating Saat Ini</p>
               <h3 className="text-4xl font-black">{product.rating.toFixed(1)} <span className="text-lg opacity-50">/ 5.0</span></h3>
             </div>
             <div className="flex text-amber-400 text-2xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className={`${s <= Math.round(product.rating) ? 'fa-solid' : 'fa-regular'} fa-star mx-0.5`}></i>
                ))}
             </div>
          </div>

          {/* Form Pengiriman */}
          <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <h3 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-widest">Bagikan Pengalaman Anda</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-all hover:scale-125 px-1"
                      >
                        <i className={`${star <= (hoverRating || rating) ? 'fa-solid text-amber-500' : 'fa-regular text-slate-200'} fa-star`}></i>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">Beri Nilai!</span>
                </div>
                
                <div className="flex-1 w-full max-w-xs">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">URL Video (Opsional)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-2 text-xs focus:ring-0 focus:border-indigo-500 outline-none transition-all shadow-inner"
                      placeholder="Tautan YouTube atau MP4 langsung..."
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                      <i className="fa-solid fa-video"></i>
                    </div>
                  </div>
                </div>
              </div>

              {videoUrl && (
                <div className="animate-fade-in aspect-video bg-slate-900 rounded-2xl overflow-hidden relative group border-4 border-white shadow-xl">
                  <video 
                    src={videoUrl} 
                    className="w-full h-full object-cover" 
                    controls 
                  />
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">PRATINJAU VIDEO</div>
                </div>
              )}

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Apa yang membuat Anda menyukai produk ini? Cerita Anda menginspirasi orang lain!"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-0 focus:border-indigo-500 outline-none min-h-[120px] transition-all shadow-inner"
                required
              />
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
              >
                <span>Kirim Pengalaman Saya</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>

          {/* Daftar Ulasan */}
          <div className="space-y-6 pb-4">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.3em] flex items-center">
              Cerita Siswa
            </h3>
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-300 italic font-medium">
                Menunggu cerita siswa pertama...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {[...reviews].reverse().map((review, idx) => (
                  <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5 group hover:border-indigo-200 transition-all">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white shrink-0 ${
                      idx % 2 === 0 ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`}>
                      {review.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-slate-900">{review.userName}</p>
                        <span className="text-[10px] font-bold text-slate-300">
                          {new Date(review.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center mb-3 space-x-2">
                        <div className="flex text-amber-400 text-[10px]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i key={s} className={`${s <= review.rating ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                          ))}
                        </div>
                        {review.videoUrl && (
                          <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">Ulasan Video</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed italic mb-4">
                        "{review.comment}"
                      </p>
                      {review.videoUrl && (
                        <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-sm border border-slate-100">
                          <video src={review.videoUrl} className="w-full h-auto aspect-video object-cover" controls muted />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
