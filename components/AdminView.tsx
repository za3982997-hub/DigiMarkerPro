
import React, { useState, useMemo, useRef } from 'react';
import { Product, Category, FAQ, Review } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onExit: () => void;
  reviews: Review[];
  onUpdateReview: (review: Review) => void;
  onDeleteReview: (id: string) => void;
}

const CATEGORIES: Category[] = ['Kursus', 'E-book', 'Sistem', 'Cetak', 'Toolkit', 'Templat'];

const AdminView: React.FC<AdminViewProps> = ({ 
  products, 
  onUpdateProduct, 
  onDeleteProduct, 
  onExit,
  reviews,
  onUpdateReview,
  onDeleteReview
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'info' | 'reviews'>('info');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Kursus',
    image: '',
    instructor: '',
    features: [],
    modules: [],
    faqs: []
  });

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      ...p,
      features: p.features || [],
      modules: p.modules || [],
      faqs: p.faqs || []
    });
    setIsAdding(true);
    setIsPreviewMode(false);
    setActiveAdminTab('info');
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setForm({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      price: 0,
      rating: 5,
      reviews: 0,
      category: 'Kursus',
      image: '',
      instructor: '',
      features: ['Dukungan 24/7', 'Akses Seumur Hidup'],
      modules: [],
      faqs: []
    });
    setIsAdding(true);
    setIsPreviewMode(false);
    setActiveAdminTab('info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProduct(form as Product);
    setIsAdding(false);
  };

  const handleGenerateAIImage = async () => {
    if (!form.name) {
      alert("Masukkan nama produk terlebih dahulu agar AI tahu apa yang harus dibuat.");
      return;
    }

    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Create a professional, modern, and high-quality product cover for a digital asset named "${form.name}". 
      Description: ${form.description || 'A premium digital product'}. 
      Style: Clean 3D render or professional flat design, vibrant but professional colors, suitable for an e-commerce platform. 
      No text on the image. High-end digital look.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      const candidate = response.candidates[0];
      if (candidate && candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64Data}`;
            setForm(prev => ({ ...prev, image: imageUrl }));
            return;
          }
        }
      }
      throw new Error("Tidak ada data gambar dari AI.");
    } catch (error) {
      console.error("AI Image Generation Error:", error);
      alert("Gagal membuat gambar. Silakan coba lagi.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = descriptionRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = form.description || '';
    const selected = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + prefix + selected + suffix + after;
    setForm({ ...form, description: newText });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const filteredInventory = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase())
    );
  }, [products, inventorySearch]);

  const productReviews = useMemo(() => {
    if (!editingProduct) return [];
    return reviews.filter(r => r.productId === editingProduct.id);
  }, [editingProduct, reviews]);

  const renderMarkdownPreview = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        let processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/^- (.*)/g, '<li>$1</li>');
        
        if (processed.startsWith('<li>')) {
          return <ul key={i} className="list-disc ml-6 my-1"><span dangerouslySetInnerHTML={{ __html: processed }} /></ul>;
        }
        return <p key={i} className="mb-2 min-h-[1em]" dangerouslySetInnerHTML={{ __html: processed }} />;
      });
  };

  const handleModuleChange = (idx: number, val: string) => {
    const newModules = [...(form.modules || [])];
    newModules[idx] = val;
    setForm({ ...form, modules: newModules });
  };
  const addModuleRow = () => setForm({ ...form, modules: [...(form.modules || []), ''] });
  const removeModuleRow = (idx: number) => setForm({ ...form, modules: (form.modules || []).filter((_, i) => i !== idx) });
  
  const moveModule = (idx: number, direction: 'up' | 'down') => {
    const modules = [...(form.modules || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;
    
    [modules[idx], modules[targetIdx]] = [modules[targetIdx], modules[idx]];
    setForm({ ...form, modules });
  };

  const handleFeatureChange = (idx: number, val: string) => {
    const newFeatures = [...(form.features || [])];
    newFeatures[idx] = val;
    setForm({ ...form, features: newFeatures });
  };
  const addFeatureRow = () => setForm({ ...form, features: [...(form.features || []), ''] });
  const removeFeatureRow = (idx: number) => setForm({ ...form, features: (form.features || []).filter((_, i) => i !== idx) });

  const handleUpdateReviewField = (id: string, field: keyof Review, value: any) => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      onUpdateReview({ ...review, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center">
            <i className="fa-solid fa-shield-halved mr-4 text-indigo-600"></i>
            Kontrol Inventaris
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Tambah, edit, atau hapus produk digital premium dari toko Anda.</p>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-3">
          <button 
            onClick={handleAddNew}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Produk Baru
          </button>
          <button 
            onClick={onExit}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
          >
            Keluar Admin
          </button>
        </div>
      </div>

      {isAdding ? (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden mb-12 animate-slide-up">
          <div className="bg-slate-50 border-b border-slate-100 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-pen-nib text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {editingProduct ? `Mengedit: ${editingProduct.name}` : 'Daftarkan Aset Baru'}
                </h2>
                <div className="flex space-x-4 mt-2">
                   <button 
                    onClick={() => setActiveAdminTab('info')}
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeAdminTab === 'info' ? 'text-indigo-600 underline' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     Informasi Aset
                   </button>
                   {editingProduct && (
                     <button 
                      onClick={() => setActiveAdminTab('reviews')}
                      className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeAdminTab === 'reviews' ? 'text-indigo-600 underline' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       Bukti Sosial ({productReviews.length})
                     </button>
                   )}
                </div>
              </div>
            </div>
            <button onClick={() => setIsAdding(false)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center transition-all shadow-sm">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {activeAdminTab === 'info' ? (
              <form onSubmit={handleSave} className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-info-circle mr-2"></i> Informasi Utama
                      </h3>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Nama Produk</label>
                        <input 
                          type="text" 
                          value={form.name} 
                          onChange={e => setForm({...form, name: e.target.value})}
                          className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-4 outline-none font-bold transition-all shadow-sm"
                          placeholder="misal: Mastering Python AI"
                          required 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-3 ml-1">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Deskripsi Detail</label>
                          <button 
                            type="button"
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                              isPreviewMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                            }`}
                          >
                            {isPreviewMode ? 'Tutup Pratinjau' : 'Pratinjau Langsung'}
                          </button>
                        </div>

                        <div className="relative group">
                          {!isPreviewMode && (
                            <div className="absolute top-3 right-3 flex space-x-2 z-10">
                              <button 
                                type="button"
                                onClick={() => insertFormatting('**', '**')}
                                className="w-8 h-8 bg-white border border-slate-100 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                                title="Bold"
                              >
                                <i className="fa-solid fa-bold text-xs"></i>
                              </button>
                              <button 
                                type="button"
                                onClick={() => insertFormatting('*', '*')}
                                className="w-8 h-8 bg-white border border-slate-100 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                                title="Italic"
                              >
                                <i className="fa-solid fa-italic text-xs"></i>
                              </button>
                            </div>
                          )}

                          <div className="min-h-[220px]">
                            {isPreviewMode ? (
                              <div className="w-full bg-white border-2 border-indigo-100 rounded-2xl p-6 min-h-[220px] text-slate-700 text-sm overflow-y-auto max-h-[400px]">
                                {renderMarkdownPreview(form.description || '')}
                              </div>
                            ) : (
                              <textarea 
                                ref={descriptionRef}
                                value={form.description} 
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-6 outline-none font-mono text-sm leading-relaxed min-h-[220px] transition-all shadow-sm"
                                placeholder="Gunakan **tebal** untuk penekanan, *miring* untuk gaya..."
                                required 
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Kategori</label>
                          <select 
                            value={form.category} 
                            onChange={e => setForm({...form, category: e.target.value as Category})}
                            className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-4 outline-none font-bold shadow-sm"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Harga (Rp)</label>
                          <input 
                            type="number" 
                            value={form.price} 
                            onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                            className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-4 outline-none font-bold transition-all shadow-sm"
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-list-check mr-2"></i> Fitur & Keuntungan Utama
                      </h3>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {(form.features || []).map((feature, i) => (
                          <div key={i} className="flex space-x-2 animate-slide-in">
                            <input 
                              type="text" 
                              value={feature} 
                              onChange={e => handleFeatureChange(i, e.target.value)}
                              className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-2 outline-none font-medium text-sm transition-all"
                              placeholder={`Keuntungan ${i+1}`}
                            />
                            <button type="button" onClick={() => removeFeatureRow(i)} className="text-rose-500 px-2"><i className="fa-solid fa-trash-can"></i></button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addFeatureRow} className="w-full py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 transition-colors">Tambah Keuntungan</button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-image mr-2"></i> Media & Branding
                      </h3>
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 bg-slate-200 rounded-2xl overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                          {isGeneratingImage ? (
                            <div className="flex flex-col items-center">
                               <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <img src={form.image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input 
                            type="text" 
                            value={form.image} 
                            onChange={e => setForm({...form, image: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl px-4 py-3 outline-none font-mono text-xs transition-all shadow-sm"
                            placeholder="URL Cover Aset"
                            required 
                          />
                          <button
                            type="button"
                            onClick={handleGenerateAIImage}
                            disabled={isGeneratingImage || !form.name}
                            className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                          >
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Buat Cover dengan AI</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Penulis / Instruktur</label>
                        <input 
                          type="text" 
                          value={form.instructor} 
                          onChange={e => setForm({...form, instructor: e.target.value})}
                          className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-4 outline-none font-bold transition-all shadow-sm"
                          placeholder="misal: Dr. Sarah Jenkins"
                        />
                      </div>
                    </div>
                    
                    {form.category === 'Kursus' && (
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Roadmap Pembelajaran</h3>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{(form.modules || []).length} Modul</span>
                        </div>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {(form.modules || []).map((mod, i) => (
                            <div key={i} className="flex items-center space-x-2 animate-slide-in group">
                              <div className="flex flex-col">
                                <button type="button" disabled={i === 0} onClick={() => moveModule(i, 'up')} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30"><i className="fa-solid fa-chevron-up text-[8px]"></i></button>
                                <button type="button" disabled={i === (form.modules || []).length - 1} onClick={() => moveModule(i, 'down')} className="text-slate-300 hover:text-indigo-600 disabled:opacity-30"><i className="fa-solid fa-chevron-down text-[8px]"></i></button>
                              </div>
                              <input 
                                type="text" 
                                value={mod} 
                                onChange={e => handleModuleChange(i, e.target.value)}
                                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-2 outline-none font-medium text-sm transition-all shadow-inner"
                                placeholder={`Pelajaran ${i+1}`}
                              />
                              <button type="button" onClick={() => removeModuleRow(i)} className="text-rose-400"><i className="fa-solid fa-trash-can"></i></button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={addModuleRow} className="w-full py-4 bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-2xl transition-all text-xs font-black uppercase">Tambah Modul</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex justify-end items-center space-x-6">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-10 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">Batalkan</button>
                  <button type="submit" className="px-16 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">Simpan Informasi Aset</button>
                </div>
              </form>
            ) : (
              <div className="animate-fade-in space-y-10">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                    <i className="fa-solid fa-comments mr-2 text-indigo-600"></i> Manajemen Bukti Sosial
                   </h3>
                   <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                     Total {productReviews.length} Masukan
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {productReviews.length === 0 ? (
                    <div className="col-span-2 py-20 text-center bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-100">
                       <i className="fa-solid fa-message text-slate-200 text-5xl mb-4"></i>
                       <p className="text-slate-400 font-bold">Belum ada ulasan untuk aset ini.</p>
                    </div>
                  ) : (
                    productReviews.map(r => (
                      <div key={r.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group hover:border-indigo-100 transition-all">
                        <button 
                          onClick={() => onDeleteReview(r.id)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-600 z-10"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                        
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="font-black text-slate-900">{r.userName}</p>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <i key={s} className={`fa-solid fa-star text-[8px] ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}></i>
                                ))}
                              </div>
                           </div>

                           <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Testimoni Siswa</label>
                              <textarea 
                                value={r.comment}
                                onChange={(e) => handleUpdateReviewField(r.id, 'comment', e.target.value)}
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-xs font-medium outline-none transition-all shadow-inner leading-relaxed min-h-[80px]"
                              />
                           </div>

                           <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">URL Video Ulasan</label>
                              <div className="flex items-center space-x-3">
                                <input 
                                  type="text" 
                                  value={r.videoUrl || ''}
                                  onChange={(e) => handleUpdateReviewField(r.id, 'videoUrl', e.target.value)}
                                  className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-2 text-xs font-mono transition-all shadow-inner"
                                  placeholder="https://..."
                                />
                                {r.videoUrl && (
                                   <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center animate-pulse">
                                      <i className="fa-solid fa-check"></i>
                                   </div>
                                )}
                              </div>
                              {r.videoUrl && (
                                <div className="mt-4 aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                                   <video src={r.videoUrl} className="w-full h-full object-cover" controls muted />
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Cari inventaris berdasarkan nama, ID, atau kategori..."
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none font-medium text-sm transition-all"
              />
            </div>
            <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-black text-xs">
              {products.length} Item Total
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Produk</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100" alt="" />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">UID: {p.id} • Rp {p.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-indigo-100/50">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => handleEdit(p)} className="w-10 h-10 bg-white border border-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
                            <i className="fa-solid fa-pen-to-square text-sm"></i>
                          </button>
                          <button onClick={() => { if(window.confirm('Hapus aset secara permanen?')) onDeleteProduct(p.id) }} className="w-10 h-10 bg-white border border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm">
                            <i className="fa-solid fa-trash-can text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
