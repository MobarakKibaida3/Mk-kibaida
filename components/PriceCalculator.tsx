'use client';

import React, { useState } from 'react';
import { translations } from '@/lib/translations';
import { Language, ServiceItem, CurrencyCode } from '@/lib/types';
import { convertPrice, formatPriceWithCurrency } from '@/lib/currency';
import { Calculator, Check, MessageCircle, Sparkles, Tag, ArrowRight, ArrowLeft } from 'lucide-react';

interface PriceCalculatorProps {
  lang: Language;
  services: ServiceItem[];
  currency?: CurrencyCode;
  onApplyBundleToForm?: (bundleSummary: string, totalPrice: number) => void;
}

export default function PriceCalculator({
  lang,
  services,
  currency = 'EGP',
  onApplyBundleToForm,
}: PriceCalculatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['full-store-bundle', 'animated-logo']);
  const t = translations[lang].calculator;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedServices = services.filter((s) => selectedIds.includes(s.id));
  const subtotalEGP = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const isBundleDiscount = selectedServices.length >= 2;
  const discountAmountEGP = isBundleDiscount ? Math.round(subtotalEGP * 0.1) : 0;
  const finalTotalEGP = subtotalEGP - discountAmountEGP;

  // Currency conversions
  const subtotalConverted = convertPrice(subtotalEGP, currency).amount;
  const discountConverted = convertPrice(discountAmountEGP, currency).amount;
  const finalTotalConverted = convertPrice(finalTotalEGP, currency).amount;
  const currencyMeta = formatPriceWithCurrency(finalTotalEGP, currency, lang);

  const handleOrderBundleWhatsApp = () => {
    if (selectedServices.length === 0) return;
    const names = selectedServices
      .map((s) => {
        const itemPrice = formatPriceWithCurrency(s.price, currency, lang);
        return `- ${lang === 'ar' ? s.nameAr : s.nameEn} (${itemPrice.fullLabel})`;
      })
      .join('\n');

    const message = 
`طلب باقة مخصصة عبر حاسبة الأسعار
━━━━━━━━━━━━
الخدمات المختارة:
${names}

الإجمالي قبل الخصم: ${subtotalConverted.toLocaleString()} ${currencyMeta.name}
${isBundleDiscount ? `خصم الباقة (10%): -${discountConverted.toLocaleString()} ${currencyMeta.name}\n` : ''}الإجمالي النهائي: ${finalTotalConverted.toLocaleString()} ${currencyMeta.name} (${currencyMeta.symbol})
العملة المختارة: ${currencyMeta.name} (${currency})
أرغب في بدء التنسيق معكم لتنفيذ هذه الباقة المخصصة.`;

    const url = `https://wa.me/201033615727?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="calculator" className="py-20 bg-[#0E0E0E] relative border-t border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191919] border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أداة حساب التكلفة الفورية' : 'Instant Cost Calculator'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-3">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Services Selector Checklist */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs uppercase tracking-wider text-[#C9A227] font-bold">
                {t.selectServices}
              </span>
              <span className="text-xs text-neutral-400">
                {selectedServices.length} {lang === 'ar' ? 'مختارة' : 'selected'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {services.slice(0, 10).map((service) => {
                const isChecked = selectedIds.includes(service.id);
                const name = lang === 'ar' ? service.nameAr : service.nameEn;
                const formattedPrice = formatPriceWithCurrency(service.price, currency, lang);

                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-[#1A170F] border-[#C9A227]/80 text-white'
                        : 'bg-[#141414] border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-[#C9A227] border-[#C9A227] text-black'
                            : 'border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium leading-tight">
                        {name}
                      </span>
                    </div>

                    <span className="text-sm font-bold font-mono tabular-nums text-[#E5C158] shrink-0 ml-3 mr-3">
                      {formattedPrice.fullLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Total & Bundle Summary Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-2xl bg-[#141414] border border-[#C9A227]/40 p-6 sm:p-7 shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-sm font-bold text-white font-serif">
                  {lang === 'ar' ? 'تفاصيل الباقة المحسوبة' : 'Calculated Bundle'}
                </span>
                {isBundleDiscount && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    <Tag className="w-3 h-3" />
                    <span>-10% Bundle Bonus</span>
                  </div>
                )}
              </div>

              {/* Selected items list */}
              <div className="py-4 space-y-2 min-h-[100px] border-b border-neutral-800">
                {selectedServices.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-4 text-center">
                    {t.noSelection}
                  </p>
                ) : (
                  selectedServices.map((s) => {
                    const formatted = formatPriceWithCurrency(s.price, currency, lang);
                    return (
                      <div key={s.id} className="flex justify-between items-center text-xs text-neutral-300">
                        <span className="truncate max-w-[200px] sm:max-w-[240px]">
                          {lang === 'ar' ? s.nameAr : s.nameEn}
                        </span>
                        <span className="font-mono tabular-nums text-neutral-400">
                          {formatted.fullLabel}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Math breakdown */}
              <div className="py-4 space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{t.totalBeforeDiscount}</span>
                  <span className="font-mono tabular-nums">
                    {subtotalConverted.toLocaleString()} {currencyMeta.symbol}
                  </span>
                </div>

                {isBundleDiscount && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>{t.bundleDiscount}</span>
                    <span className="font-mono tabular-nums">
                      -{discountConverted.toLocaleString()} {currencyMeta.symbol}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-800">
                  <span className="text-sm font-bold text-white">
                    {t.finalTotal}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] font-mono tabular-nums">
                      {finalTotalConverted.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400 ml-1.5 mr-1.5 font-bold">
                      {currencyMeta.symbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Order Action */}
              <button
                onClick={handleOrderBundleWhatsApp}
                disabled={selectedServices.length === 0}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,162,39,0.3)] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>{t.orderWhatsApp}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-neutral-400">
                  {lang === 'ar' ? 'يتم تحويل الطلب ببيانات التسعير المختارة مباشرة إلى واتساب' : 'Instantly transfer calculation to WhatsApp'}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
