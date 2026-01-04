
import React, { useState } from 'react';
import { Product } from '../types';
import CertificateModal from './CertificateModal';

interface CoursePlayerProps {
  product: Product;
  completedModules: string[];
  onToggleModule: (moduleName: string) => void;
  onBack: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ product, completedModules, onToggleModule, onBack }) => {
  const [showCert, setShowCert] = useState(false);
  
  const totalModules = product.modules?.length || 0;
  const completedCount = completedModules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const isFinished = progressPercent === 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Video/Study Area placeholder */}
        <div className="flex-1 space-y-6">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Library
          </button>
          
          <div className="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center text-white relative overflow-hidden group shadow-2xl">
            <img 
              src={product.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm group-hover:opacity-20 transition-opacity" 
              alt="" 
            />
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/50 cursor-pointer hover:scale-110 transition-transform">
                <i className="fa-solid fa-play text-2xl ml-1"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">Watching: {completedModules[0] || product.modules?.[0] || 'Introduction'}</h3>
              <p className="text-slate-400">Lesson video would play here in a production environment.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{product.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center">
                <i className="fa-solid fa-chalkboard-user mr-2 text-indigo-500"></i>
                {product.instructor}
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase text-slate-400">
                Course Access
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Right Side: Modules Checklist & Progress */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 overflow-hidden relative">
            {isFinished && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 rounded-bl-2xl font-bold text-[10px] animate-bounce">
                READY TO DOWNLOAD!
              </div>
            )}
            
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <i className="fa-solid fa-chart-line mr-3 text-indigo-600"></i>
              Course Progress
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-500">{progressPercent}% Completed</span>
              <span className="text-xs text-slate-400">{completedCount}/{totalModules} Lessons</span>
            </div>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {isFinished ? (
              <button 
                onClick={() => setShowCert(true)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center space-x-2 animate-pulse"
              >
                <i className="fa-solid fa-certificate"></i>
                <span>Get My Certificate</span>
              </button>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-medium text-slate-500">
                  Finish all modules to unlock your digital certificate.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Curriculum</h3>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
              {product.modules?.map((module, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 flex items-center group cursor-pointer hover:bg-indigo-50/30 transition-colors ${completedModules.includes(module) ? 'bg-emerald-50/30' : ''}`}
                  onClick={() => onToggleModule(module)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-4 transition-all ${
                    completedModules.includes(module) 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}>
                    {completedModules.includes(module) ? <i className="fa-solid fa-check"></i> : idx + 1}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${completedModules.includes(module) ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {module}
                  </span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-indigo-400 hover:text-indigo-600">
                      <i className="fa-solid fa-circle-play text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CertificateModal 
        isOpen={showCert} 
        onClose={() => setShowCert(false)} 
        productName={product.name}
        userName="Verified Student" // In real app, use profile name
      />
    </div>
  );
};

export default CoursePlayer;
