
import React from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  userName: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, productName, userName }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-scale-in no-print">
        {/* Actions Bar */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center space-x-2 text-indigo-600">
            <i className="fa-solid fa-award text-xl"></i>
            <h2 className="font-black tracking-tight">COURSE CERTIFICATE</h2>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handlePrint}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center"
            >
              <i className="fa-solid fa-download mr-2"></i>
              Download PDF
            </button>
            <button onClick={onClose} className="p-2.5 text-slate-400 hover:bg-slate-200 rounded-full transition-all">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="flex-1 p-8 sm:p-16 flex items-center justify-center bg-slate-100 overflow-y-auto">
          <div className="certificate-paper w-full max-w-[800px] aspect-[1.414/1] bg-white shadow-2xl relative p-10 sm:p-20 border-[20px] border-slate-900">
            {/* Border Details */}
            <div className="absolute inset-2 border-2 border-slate-200 pointer-events-none"></div>
            
            {/* Corner Emblems */}
            <div className="absolute top-4 left-4 text-indigo-200 opacity-20 text-6xl">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            
            <div className="text-center h-full flex flex-col justify-between items-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-xl shadow-indigo-100">D</div>
                <p className="text-slate-400 font-bold tracking-[0.3em] text-xs uppercase">Certificate of Completion</p>
              </div>

              <div className="space-y-6 my-10">
                <h4 className="text-slate-500 font-medium">This is to certify that</h4>
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 font-serif italic border-b-4 border-slate-900 pb-2 px-10">
                  {userName}
                </h1>
                <h4 className="text-slate-500 font-medium">has successfully completed the premium digital course</h4>
                <h2 className="text-2xl sm:text-3xl font-black text-indigo-600 uppercase tracking-tight">
                  {productName}
                </h2>
              </div>

              <div className="w-full flex justify-between items-end mt-12">
                <div className="text-left space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                  <p className="font-bold text-slate-900">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 relative mb-2">
                     <i className="fa-solid fa-certificate text-amber-400 text-8xl"></i>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <i className="fa-solid fa-award text-white text-3xl"></i>
                     </div>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">DigiMarket Verified</p>
                </div>

                <div className="text-right space-y-2">
                  <div className="h-[1px] w-32 bg-slate-300 ml-auto mb-2"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Director</p>
                  <p className="font-bold text-slate-900 italic font-serif text-sm">Sarah Jenkins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-paper, .certificate-paper * { visibility: visible; }
          .certificate-paper { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: 100%; 
            margin: 0; 
            border: 20px solid black;
          }
          .no-print { display: none !important; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default CertificateModal;
