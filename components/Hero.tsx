
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            Tingkatkan <span className="text-indigo-600">Karir Digital</span> Anda
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Pasar premium untuk kursus online, perangkat lunak, dan aset kreatif kelas dunia. 
            Dibuat untuk pengembang, desainer, dan pengusaha.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
              Jelajahi Katalog
            </button>
            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl border-2 border-indigo-50 hover:border-indigo-100 transition-all">
              Jadi Penjual
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 -left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-10 w-72 h-72 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
    </div>
  );
};

export default Hero;
