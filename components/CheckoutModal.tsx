
import React, { useState } from 'react';
import { CartItem, PaymentMethod, PaymentMethodId } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'credit-card', name: 'Kartu Kredit / Debit', icon: 'fa-solid fa-credit-card', description: 'Visa, Mastercard, JCB' },
  { id: 'gopay', name: 'GoPay', icon: 'fa-solid fa-wallet', description: 'Pembayaran instan via aplikasi Gojek' },
  { id: 'ovo', name: 'OVO', icon: 'fa-solid fa-mobile-screen', description: 'Pembayaran digital via OVO' },
  { id: 'bank-transfer', name: 'Virtual Account', icon: 'fa-solid fa-building-columns', description: 'BCA, Mandiri, BNI' },
  { id: 'paypal', name: 'PayPal', icon: 'fa-brands fa-paypal', description: 'Pembayaran internasional aman' }
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items, onSuccess }) => {
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11; // 11% Tax (PPN)
  const total = subtotal + tax;

  const handlePay = () => {
    if (!selectedMethod) return;
    setStep('processing');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const handleFinish = () => {
    onSuccess();
    setStep('selection');
    setSelectedMethod(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={step === 'processing' ? undefined : onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {step === 'selection' && (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Checkout Aman</h2>
                <p className="text-slate-500 text-sm">Pilih metode pembayaran pilihan Anda</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Metode Pembayaran</h3>
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedMethod === method.id 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 hover:border-indigo-200 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                      selectedMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <i className={`${method.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${selectedMethod === method.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {method.name}
                      </p>
                      <p className="text-xs text-slate-500">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="text-indigo-600">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-2xl p-6 h-fit border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 line-clamp-1 flex-1 mr-2">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>PPN (11%)</span>
                    <span>Rp {tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <button
                  disabled={!selectedMethod}
                  onClick={handlePay}
                  className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Bayar Sekarang</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4">
                  Data Anda dienkripsi dan aman. Dengan membayar, Anda menyetujui Ketentuan kami.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-lock text-indigo-200"></i>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Memproses Pembayaran</h2>
              <p className="text-slate-500 mt-2">Mohon tidak menyegarkan atau menutup browser...</p>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <i className="fa-solid fa-check text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Pembelian Berhasil!</h2>
            <p className="text-slate-500 max-w-sm mb-10">
              Terima kasih atas pesanan Anda. Produk digital Anda sekarang tersedia di perpustakaan akun Anda.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                Ke Perpustakaan Saya
              </button>
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                Lanjutkan Belanja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
