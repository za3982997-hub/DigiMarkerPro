
import React from 'react';
import { Product } from '../types';

interface DashboardViewProps {
  purchasedCount: number;
  wishlistCount: number;
  onExplore: () => void;
  onViewLibrary: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ purchasedCount, wishlistCount, onExplore, onViewLibrary }) => {
  const stats = [
    { label: 'Produk Dibeli', value: purchasedCount, icon: 'fa-solid fa-box-open', color: 'bg-indigo-500' },
    { label: 'Kursus Berjalan', value: Math.min(purchasedCount, 2), icon: 'fa-solid fa-graduation-cap', color: 'bg-emerald-500' },
    { label: 'Item di Wishlist', value: wishlistCount, icon: 'fa-solid fa-heart', color: 'bg-rose-500' },
    { label: 'Poin Reward', value: purchasedCount * 150, icon: 'fa-solid fa-star', color: 'bg-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Selamat datang kembali!</h1>
          <p className="text-slate-500 mt-2">Kelola aset digital Anda dan pantau progres belajar.</p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-4">
          <button 
            onClick={onExplore}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Jelajahi Katalog
          </button>
          <button 
            onClick={onViewLibrary}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Perpustakaan Saya
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 text-xl shadow-lg`}>
              <i className={stat.icon}></i>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <i className="fa-solid fa-clock-rotate-left mr-3 text-indigo-600"></i>
            Aktivitas Terakhir
          </h2>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            {purchasedCount > 0 ? (
              <div className="divide-y divide-slate-50">
                <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600">
                      <i className="fa-solid fa-file-arrow-down"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Resource Diunduh</p>
                      <p className="text-xs text-slate-400">2 jam yang lalu</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 font-bold text-sm hover:underline">Detail</button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic">
                Belum ada aktivitas terbaru.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <i className="fa-solid fa-headset mr-3 text-indigo-600"></i>
            Butuh Bantuan?
          </h2>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-3">Dukungan Prioritas 24/7</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Tim ahli kami siap membantu Anda dengan masalah teknis atau pembayaran.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all">
              Hubungi Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
