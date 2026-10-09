'use client';

import React from 'react';
import Image from 'next/image';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { MessageCircle, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  const t = translations[lang].hero;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const defaultWaMessage = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً مبارك! أرغب في الاستفسار عن خدمات التصميم وتصميم المتاجر الإلكترونية.'
      : 'Hello Mobarak! I would like to inquire about your e-commerce store and design services.'
  );

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#0A0A0A]">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#C9A227]/12 via-[#C9A227]/4 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-40 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Golden Geometric Grid Background Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A227 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            
            {/* Elegant Studio Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/30 mb-6 shadow-[0_0_15px_rgba(201,162,39,0.08)]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-xs font-medium text-[#C9A227] tracking-wide">
                {t.tagline}
              </span>
            </div>

            {/* Main Headline with Optical Compensation */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] mb-6 max-w-2xl font-serif">
              {t.headlineStart}{' '}
              <span className="bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] bg-clip-text text-transparent underline decoration-[#C9A227]/40 underline-offset-8">
                {t.headlineHighlight}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-xl font-normal">
              {t.subheadline}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#order-form"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-black bg-gradient-to-r from-[#E5C158] via-[#C9A227] to-[#A38018] hover:from-[#FFF099] hover:to-[#C9A227] rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.35)] transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowIcon className="w-4 h-4 mr-2 ml-2 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={`https://wa.me/201033615727?text=${defaultWaMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:text-white bg-[#141414] hover:bg-[#1C1C1C] border border-neutral-800 hover:border-[#C9A227]/50 rounded-xl transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] mr-2 ml-2" />
                <span>{t.ctaSecondary}</span>
              </a>
            </div>

            {/* Trust Assurance Statement */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 bg-neutral-900/50 px-3 py-2 rounded-lg border border-neutral-800/80">
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>{t.badgeGuarantee}</span>
            </div>

            {/* Social Proof Numbers - Clean unboxed text layout */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 border-t border-neutral-800/80 pt-6 w-full max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                  {t.metric1Value}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {t.metric1Label}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#C9A227]">
                  {t.metric2Value}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {t.metric2Label}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                  {t.metric3Value}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {t.metric3Label}
                </div>
              </div>
            </div>

          </div>

          {/* Focal Visual Showcase Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Frame Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#C9A227]/30 via-[#FFECA8]/10 to-[#C9A227]/20 rounded-2xl blur-lg opacity-75" />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#C9A227]/30 bg-[#141414] shadow-2xl aspect-[16/10]">
                <Image
                  src="/images/hero_luxury_showcase_1791020864553.jpg"
                  alt="Mobarak Kibaida Luxury Design Showcase"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Floating Verified Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0A0A0A]/90 backdrop-blur-md border border-[#C9A227]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center border border-[#C9A227]/30">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {lang === 'ar' ? 'تصميم حصري ومخصص 100%' : '100% Bespoke Custom Design'}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {lang === 'ar' ? 'تسليم ملفات العمل كاملة' : 'Full Source Files Included'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#C9A227] font-semibold">
                    #MK-VIP
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
