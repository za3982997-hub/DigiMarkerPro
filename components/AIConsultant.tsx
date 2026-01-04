
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiRecommendation } from '../services/geminiService';
import { Product, ChatMessage } from '../types';

interface AIConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  productCatalog: Product[];
  onAddFromAI: (productId: string) => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ isOpen, onClose, productCatalog, onAddFromAI }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Halo! 👋 Saya Konsultan Keberhasilan Siswa Anda. Apakah Anda sedang mempersiapkan ujian, membangun kebiasaan baru, atau memulai karir baru? Beritahu saya tujuan Anda!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Fix: Corrected typo and removed extra spaces in the dependency array (line 26).
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsTyping(true);

    const responseText = await getGeminiRecommendation(textToSend, productCatalog);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Pengenalan suara tidak didukung di browser Anda.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg h-full sm:h-[650px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 flex justify-between items-center text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                <i className="fa-solid fa-graduation-cap text-xl"></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Konsultan Belajar</h2>
              <span className="text-xs text-indigo-100 flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Spesialis Keberhasilan Siswa
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-6 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[90%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {m.text.split(/\[PRODUCT_ID:([^\]]+)\]/g).map((part, i) => {
                  if (i % 2 === 1) {
                    const prodId = part.trim();
                    const prod = productCatalog.find(p => p.id === prodId);
                    return (
                      <div key={i} className="my-3 p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 flex items-center space-x-3 group hover:bg-indigo-50 transition-all">
                        <img src={prod?.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-indigo-900 text-xs truncate">{prod?.name || 'Alat Rekomendasi'}</p>
                          <p className="text-indigo-600 font-bold text-[10px] mt-0.5">Rp {prod?.price.toLocaleString('id-ID') || '0'}</p>
                        </div>
                        <button 
                          onClick={() => onAddFromAI(prodId)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md shadow-indigo-200 transition-all"
                        >
                          Tambah
                        </button>
                      </div>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-medium italic">Konsultan sedang berpikir</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={startVoiceInput}
              className={`p-3 rounded-xl transition-all ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
              title="Input Suara"
            >
              <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Mendengarkan..." : "Ceritakan tujuan belajar Anda..."}
                className="w-full bg-slate-100 border-2 border-transparent rounded-xl py-3 px-4 focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none text-sm font-medium"
              />
            </div>
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <p className="text-[9px] text-center text-slate-400 mt-3 font-medium tracking-tight">
            Saya bisa membantu rencana belajar, pemilihan alat, dan membangun kebiasaan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
