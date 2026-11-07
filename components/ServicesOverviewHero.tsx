'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '@/lib/types';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Briefcase, 
  ShoppingBag, 
  CheckCircle2, 
  Star,
  ExternalLink
} from 'lucide-react';

interface ServicesOverviewHeroProps {
  lang: Language;
}

export default function ServicesOverviewHero({ lang }: ServicesOverviewHeroProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const defaultWaMessage = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً مبارك! أرغب في بدء مشروعي والاستفسار عن خدماتك الرقمية وعروض الأسعار.'
      : 'Hello Mobarak! I would like to start my project and inquire about your digital services and quotations.'
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#0A0A0A]">
      {/* Ambient Lighting & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[700px] h-[320px] sm:h-[700px] bg-gradient-to-b from-[#C9A227]/12 via-[#C9A227]/3 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-0 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-[#E5C158]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 sm:left-10 w-48 sm:w-96 h-48 sm:h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Geometric Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A227 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Banner Switcher: Navigate to full storefront & packages */}
        <div className="flex justify-center mb-6 sm:mb-8 max-w-full">
          <Link
            href="/home"
            className="inline-flex max-w-full items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl sm:rounded-full bg-[#141414] border border-[#C9A227]/30 hover:border-[#C9A227] text-neutral-300 hover:text-white transition-all text-xs group shadow-[0_0_20px_rgba(201,162,39,0.08)] flex-wrap text-center"
          >
            <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">
              {lang === 'ar' 
                ? 'هل تبحث عن باقة متجر شوبيفاي الكاملة (عرض 6,000)؟' 
                : 'Looking for Turnkey Shopify Store Bundles?'}
            </span>
            <span className="text-[#C9A227] font-bold group-hover:underline inline-flex items-center gap-1 text-[11px] sm:text-xs shrink-0">
              <span>{lang === 'ar' ? 'تصفح باقات المتجر' : 'View Store Bundles'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          
          {/* Introductory Label */}
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/40 mb-6 shadow-[0_0_20px_rgba(201,162,39,0.12)] animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span className="text-[11px] sm:text-sm font-semibold text-[#E5C158] tracking-wide text-center">
              {lang === 'ar' 
                ? 'حلول رقمية متكاملة • إبداع بلا حدود • نمو للأعمال' 
                : 'Integrated Digital Solutions • Limitless Creativity • Business Growth'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.25] mb-5 sm:mb-6 font-serif break-words">
            {lang === 'ar' ? (
              <>
                حوّل فكرتك إلى مشروع رقمي{' '}
                <span className="bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] bg-clip-text text-transparent underline decoration-[#C9A227]/40 underline-offset-8">
                  يلفت الأنظار ويصنع النتائج
                </span>
              </>
            ) : (
              <>
                Turn Your Idea Into a Digital Venture{' '}
                <span className="bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] bg-clip-text text-transparent underline decoration-[#C9A227]/40 underline-offset-8">
                  That Captivates and Delivers Results
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-neutral-300 text-xs sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10">
            {lang === 'ar' 
              ? 'نصمّم هويتك التجارية، ونبني مواقعك ومتاجرك الإلكترونية، ونطوّر حلول الذكاء الاصطناعي والأتمتة لمساعدتك على جذب العملاء، وتعزيز علامتك التجارية، وتنمية أعمالك في جميع أنحاء العالم.'
              : 'We design your brand identity, build your websites and e-commerce stores, and develop AI and automation solutions to help you attract customers, elevate your brand, and grow your business worldwide.'}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full max-w-xl sm:max-w-none mx-auto">
            
            {/* Primary CTA Button: Request / Order Service */}
            <a
              href="#calculator"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-black bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] shadow-[0_0_25px_rgba(201,162,39,0.35)] flex items-center justify-center gap-2 group transition-all active:scale-95 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'اطلب خدمتك الآن' : 'Order Your Service Now'}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Explore Site / Preserved Homepage Link */}
            <Link
              href="/home"
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#161616] hover:bg-[#202020] border border-[#C9A227]/60 hover:border-[#E5C158] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(201,162,39,0.1)]"
            >
              <ExternalLink className="w-4 h-4 text-[#E5C158]" />
              <span>{lang === 'ar' ? 'استكشف الموقع' : 'Explore Full Site'}</span>
            </Link>

            {/* Secondary CTA Button: Explore Portfolio */}
            <a
              href="#portfolio"
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-300 hover:text-white bg-[#121212] hover:bg-[#1A1A1A] border border-neutral-800 hover:border-neutral-700 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#C9A227]" />
              <span>{lang === 'ar' ? 'استكشف أعمالنا' : 'Explore Our Work'}</span>
            </a>

            {/* Optional WhatsApp CTA */}
            <a
              href={`https://wa.me/201033615727?text=${defaultWaMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-[#25D366] bg-[#121212] hover:bg-[#1A1A1A] border border-[#25D366]/40 hover:border-[#25D366] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.12)]"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#121212]" />
              <span>{lang === 'ar' ? 'استشارة واتساب' : 'WhatsApp Chat'}</span>
            </a>

          </div>

          {/* Core Strengths & Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto pt-6 border-t border-neutral-900">
            <div className="p-3.5 rounded-xl bg-[#121212] border border-neutral-800/80 text-center">
              <span className="block text-lg sm:text-xl font-black text-[#E5C158]">6</span>
              <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
                {lang === 'ar' ? 'تخصصات رقمية متكاملة' : 'Core Disciplines'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-neutral-800/80 text-center">
              <span className="block text-lg sm:text-xl font-black text-[#E5C158] font-sans">
                {lang === 'ar' ? 'مخصص' : 'Custom'}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
                {lang === 'ar' ? 'تسعير حسب المتطلبات' : 'Tailored Quotations'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-neutral-800/80 text-center">
              <span className="block text-lg sm:text-xl font-black text-[#E5C158] font-sans">
                {lang === 'ar' ? 'مباشر' : 'Direct'}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
                {lang === 'ar' ? 'متابعة مراحل التنفيذ' : 'Transparent Milestones'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-neutral-800/80 text-center">
              <span className="block text-lg sm:text-xl font-black text-[#E5C158] font-sans">
                {lang === 'ar' ? 'شامل' : 'Turnkey'}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">
                {lang === 'ar' ? 'تسليم كامل ودعم فني' : 'Complete Delivery & Support'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
