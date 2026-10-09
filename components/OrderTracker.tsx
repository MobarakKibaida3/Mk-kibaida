'use client';

import React, { useState } from 'react';
import { translations } from '@/lib/translations';
import { Language, OrderStatus } from '@/lib/types';
import { Search, CheckCircle2, Clock, Truck, FileCheck, AlertCircle } from 'lucide-react';

interface OrderTrackerProps {
  lang: Language;
}

interface TrackedOrderResult {
  orderCode: string;
  serviceNameAr: string;
  serviceNameEn: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  clientName: string;
}

export default function OrderTracker({ lang }: OrderTrackerProps) {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedOrderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const t = translations[lang].tracker;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(`/api/track?code=${encodeURIComponent(orderCode.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم' : 'Order not found'));
      }
      setResult(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error finding order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'new', labelAr: 'تم استلام الطلب', labelEn: 'Order Received' },
    { key: 'contacted', labelAr: 'تم التواصل عبر واتساب', labelEn: 'Brief Confirmed' },
    { key: 'in_progress', labelAr: 'جاري التصميم والتنفيذ', labelEn: 'In Creative Production' },
    { key: 'delivered', labelAr: 'تم التسليم والاعتماد', labelEn: 'Delivered & Approved' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 0;
      case 'contacted':
        return 1;
      case 'in_progress':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <section id="tracker" className="py-20 bg-[#0E0E0E] relative border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191919] border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تتبع فوري ومباشر' : 'Live Order Tracker'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-3">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm">
            {t.subtitle}
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
          <div className="flex gap-2">
            <input
              type="text"
              required
              autoFocus={false}
              autoComplete="off"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white placeholder-neutral-500 text-sm font-mono uppercase focus:border-[#C9A227] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black font-bold text-xs sm:text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? t.checking : t.btn}</span>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 text-center">
            {lang === 'ar' ? 'جرب البحث برقم تجريبي: MK-1001 أو MK-1002' : 'Try searching sample order: MK-1001 or MK-1002'}
          </p>
        </form>

        {/* Error message */}
        {errorMsg && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="rounded-2xl bg-[#141414] border border-[#C9A227]/40 p-6 sm:p-8 shadow-xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">
                  {lang === 'ar' ? 'طلب رقم' : 'Order Reference'}
                </span>
                <h3 className="text-2xl font-bold font-mono text-[#E5C158]">
                  #{result.orderCode}
                </h3>
              </div>

              <div className="text-start sm:text-end">
                <span className="text-xs text-neutral-400 block mb-1">
                  {t.serviceOrdered}
                </span>
                <span className="text-sm font-bold text-white">
                  {lang === 'ar' ? result.serviceNameAr : result.serviceNameEn}
                </span>
                <span className="text-xs text-neutral-400 block mt-0.5 font-mono tabular-nums">
                  {result.price.toLocaleString()} {lang === 'ar' ? 'جنيه مصري' : 'EGP'}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="pt-8 pb-4">
              {result.status === 'cancelled' ? (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-center text-red-300 text-sm">
                  {t.statusCancelled}
                </div>
              ) : (
                <div className="relative">
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 z-0" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                    {steps.map((step, idx) => {
                      const currentIdx = getStepIndex(result.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex flex-row sm:flex-col items-center gap-3 text-start sm:text-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-[#C9A227] text-black shadow-[0_0_12px_rgba(201,162,39,0.5)]'
                                : 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div>
                            <span
                              className={`text-xs font-semibold block leading-tight ${
                                isCurrent
                                  ? 'text-[#E5C158]'
                                  : isCompleted
                                  ? 'text-white'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {lang === 'ar' ? step.labelAr : step.labelEn}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] text-[#C9A227] mt-0.5 block font-medium">
                                {lang === 'ar' ? 'المرحلة الحالية' : 'Current Stage'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>{t.orderDate} {new Date(result.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
              <a
                href="https://wa.me/201033615727"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A227] hover:underline"
              >
                {lang === 'ar' ? 'تواصل مع مبارك عبر واتساب' : 'Chat with Mobarak'}
              </a>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
