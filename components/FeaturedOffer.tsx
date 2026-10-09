'use client';

import React, { useState, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { Language, ServiceItem, CurrencyCode } from '@/lib/types';
import { formatPriceWithCurrency, convertPrice } from '@/lib/currency';
import { Sparkles, Timer, CheckCircle, ArrowLeft, ArrowRight, Flame } from 'lucide-react';

interface FeaturedOfferProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
  featuredService?: ServiceItem;
  currency?: CurrencyCode;
}

export default function FeaturedOffer({
  lang,
  onSelectService,
  featuredService,
  currency = 'EGP',
}: FeaturedOfferProps) {
  const t = translations[lang].featured;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Pricing calculations according to selected currency
  const basePriceEGP = featuredService?.price || 6000;
  const baseOldPriceEGP = 8500;

  const currentPriceFormatted = formatPriceWithCurrency(basePriceEGP, currency, lang);
  const oldPriceFormatted = formatPriceWithCurrency(baseOldPriceEGP, currency, lang);

  const oldAmount = convertPrice(baseOldPriceEGP, currency).amount;
  const currentAmount = convertPrice(basePriceEGP, currency).amount;
  const savingsAmount = Math.max(0, oldAmount - currentAmount).toLocaleString();

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimOffer = () => {
    onSelectService('full-store-bundle');
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const inclusions = [t.inc1, t.inc2, t.inc3, t.inc4, t.inc5];

  return (
    <section id="featured-offer" className="py-20 bg-gradient-to-b from-[#0A0A0A] via-[#141414] to-[#0A0A0A] relative overflow-hidden">
      {/* Golden Aura Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C9A227]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container with Luxury Dual Golden Hairline Border */}
        <div className="relative rounded-3xl bg-[#0D0D0D] border-2 border-[#C9A227]/50 shadow-[0_0_50px_rgba(201,162,39,0.18)] p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Top Marquee Ribbon */}
          <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[#C9A227] via-[#F2D785] to-[#C9A227] py-2 px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-black text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-black" />
              <span>{t.badge}</span>
              <Flame className="w-4 h-4 fill-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-6">
            
            {/* Details Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-start">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F190B] border border-[#C9A227]/40 text-[#E5C158] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الباقة الأكثر طلباً لرواد الأعمال' : 'Top Requested Launch Bundle'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-serif leading-tight">
                {t.title}
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                {t.description}
              </p>

              {/* Inclusions checklist */}
              <div className="space-y-3 w-full mb-8">
                <p className="text-xs uppercase tracking-wider text-[#C9A227] font-bold">
                  {t.includes}
                </p>
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-[#E5C158]" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Price Card & Countdown Column */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="rounded-2xl bg-[#141414] border border-[#C9A227]/40 p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative">
                
                {/* Savings Pill */}
                <div className="px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-4">
                  {lang === 'ar'
                    ? `وفر ${savingsAmount} ${currentPriceFormatted.symbol} فوراً`
                    : `Save ${savingsAmount} ${currentPriceFormatted.symbol} Instantly`}
                </div>

                {/* Strikethrough & Big Price */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-lg sm:text-xl text-neutral-500 line-through font-mono tabular-nums">
                    {oldPriceFormatted.fullLabel}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] font-mono tabular-nums">
                    {currentPriceFormatted.amountString}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-neutral-300">
                    {currentPriceFormatted.name} ({currentPriceFormatted.symbol})
                  </span>
                </div>

                {/* Real-time Limited Offer Countdown */}
                <div className="w-full bg-[#0A0A0A] rounded-xl p-4 border border-neutral-800 mb-6">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mb-3 font-medium">
                    <Timer className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{t.timeLeft}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-[#141414] rounded-lg p-2 border border-neutral-800">
                      <div className="text-lg sm:text-xl font-bold text-white font-mono">{timeLeft.days}</div>
                      <div className="text-[10px] text-neutral-400">{t.days}</div>
                    </div>
                    <div className="bg-[#141414] rounded-lg p-2 border border-neutral-800">
                      <div className="text-lg sm:text-xl font-bold text-white font-mono">{timeLeft.hours}</div>
                      <div className="text-[10px] text-neutral-400">{t.hours}</div>
                    </div>
                    <div className="bg-[#141414] rounded-lg p-2 border border-neutral-800">
                      <div className="text-lg sm:text-xl font-bold text-white font-mono">{timeLeft.minutes}</div>
                      <div className="text-[10px] text-neutral-400">{t.minutes}</div>
                    </div>
                    <div className="bg-[#141414] rounded-lg p-2 border border-neutral-800">
                      <div className="text-lg sm:text-xl font-bold text-[#E5C158] font-mono">{timeLeft.seconds}</div>
                      <div className="text-[10px] text-neutral-400">{t.seconds}</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  type="button"
                  onClick={handleClaimOffer}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(201,162,39,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t.cta || (lang === 'ar' ? 'اطلب باقة المتجر الآن' : 'Claim Store Bundle Now')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
