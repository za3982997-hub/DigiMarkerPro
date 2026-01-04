
import React, { useEffect, useState } from 'react';
import { Product } from '../types';

interface MyLibraryViewProps {
  purchasedItems: Product[];
  courseProgress: Record<string, string[]>;
  onAccess: (productId: string) => void;
  onExplore: () => void;
}

const MyLibraryView: React.FC<MyLibraryViewProps> = ({ purchasedItems, courseProgress, onAccess, onExplore }) => {
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Small delay to ensure the component is rendered before starting the progress bar animation
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12 animate-fade-in-right">
        <h1 className="text-3xl font-black text-slate-900">Perpustakaan Saya</h1>
        <p className="text-slate-500 mt-2 font-medium">Akses produk digital yang Anda beli dan pantau progres belajar Anda.</p>
      </div>

      {purchasedItems.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 animate-fade-in-up">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-book-open text-4xl text-slate-300"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Perpustakaan Anda kosong</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Anda belum membeli produk apa pun. Jelajahi katalog kami untuk memulai perjalanan belajar Anda.
          </p>
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {purchasedItems.map((item, index) => {
            const completed = courseProgress[item.id]?.length || 0;
            const total = item.modules?.length || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const isCourse = item.category === 'Kursus';

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => onAccess(item.id)}
                      className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-2xl flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                    >
                      <i className={`fa-solid ${isCourse ? 'fa-graduation-cap' : 'fa-download'}`}></i>
                      <span>{isCourse ? (percent > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar') : 'Akses File'}</span>
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 transform group-hover:translate-x-1 transition-transform">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 uppercase shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  {isCourse && percent === 100 && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                      <i className="fa-solid fa-certificate text-xs"></i>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                  
                  {isCourse && total > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Progres Kursus</span>
                        <span className={percent === 100 ? 'text-emerald-500' : 'text-indigo-600'}>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-[1500ms] ease-out ${percent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${animateProgress ? percent : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-6">
                    <div className="flex items-center text-xs text-slate-400 font-medium">
                      <i className="fa-solid fa-calendar-check mr-2 text-indigo-300"></i>
                      <span>Akses Seumur Hidup</span>
                    </div>
                    <button 
                      onClick={() => onAccess(item.id)}
                      className={`text-xs font-bold transition-all hover:translate-x-1 ${percent === 100 ? 'text-emerald-600 hover:text-emerald-700' : 'text-indigo-600 hover:text-indigo-700'}`}
                    >
                      {isCourse ? (percent === 100 ? 'Lihat Sertifikat' : 'Buka Kursus') : 'Unduh Aset'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLibraryView;
