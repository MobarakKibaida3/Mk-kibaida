'use client';

import React, { useState, useEffect } from 'react';
import MkLogo from './MkLogo';
import { translations } from '@/lib/translations';
import { Language, CurrencyCode } from '@/lib/types';
import { MessageCircle, Globe, Menu, X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
}

export default function Navbar({ lang, onToggleLang, currency, onCurrencyChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '#services', label: t.services },
    { href: '#featured-offer', label: t.featured },
    { href: '#portfolio', label: t.portfolio },
    { href: '#calculator', label: t.calculator },
    { href: '#process', label: t.process },
    { href: '#tracker', label: t.track },
    { href: '#payment-methods', label: lang === 'ar' ? 'طرق الدفع' : 'Payment' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[10000] h-[68px] sm:h-[72px] flex items-center transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-[#0A0A0A] border-b border-[#C9A227]/30 shadow-[0_4px_30px_rgba(0,0,0,0.9)]'
            : 'bg-[#0A0A0A]/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-white/5 sm:border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            {/* Zone 1: Brand Wordmark & Royal Emblem */}
            <a 
              href="#" 
              onClick={(e) => {
                if (mobileMenuOpen) {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center group cursor-pointer"
            >
              <MkLogo size="sm" showSubtitle={false} />
            </a>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-7 space-x-reverse text-xs font-semibold text-neutral-300 tracking-wide">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap hover:text-[#C9A227] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9A227] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Actions (Currency Switcher + Language Toggle + CTA) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Currency Switcher */}
              <div className="flex items-center rounded-lg border border-neutral-800 bg-[#141414] p-0.5 text-[11px] font-bold">
                {(['EGP', 'SAR', 'USD'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCurrencyChange(c)}
                    className={`px-1.5 sm:px-2 py-1 rounded-md transition-all cursor-pointer ${
                      currency === c
                        ? 'bg-[#C9A227] text-black shadow-sm font-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title={c === 'EGP' ? 'جنيه مصري' : c === 'SAR' ? 'ريال سعودي' : 'دولار أمريكي'}
                  >
                    {c === 'EGP' ? (lang === 'ar' ? 'ج.م' : 'EGP') : c === 'SAR' ? (lang === 'ar' ? 'ر.س' : 'SAR') : '$'}
                  </button>
                ))}
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={onToggleLang}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-[#141414] hover:border-[#C9A227]/40 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title="تغيير اللغة / Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
                <span className="font-sans uppercase text-[11px] sm:text-xs">{lang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Primary Order CTA - Desktop */}
              <a
                href="#order-form"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-[#E5C158] via-[#C9A227] to-[#A38018] hover:from-[#FFF099] hover:to-[#C9A227] rounded-lg shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 ml-1.5" />
                {t.orderNow}
              </a>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  mobileMenuOpen
                    ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]'
                    : 'border-neutral-800 bg-[#141414] text-neutral-300 hover:text-white'
                }`}
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Solid Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed top-[68px] sm:top-[72px] inset-x-0 bottom-0 z-[9999] bg-[#0A0A0A] flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-3 duration-200 border-t border-[#C9A227]/30"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Menu Items Container */}
          <div className="px-6 py-6 space-y-1">
            
            {/* Quick Header Tag inside Menu */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-800">
              <span className="text-[11px] font-bold text-[#C9A227] tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'القائمة الرئيسية' : 'MAIN NAVIGATION'}</span>
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Mobarak Kibaida
              </span>
            </div>

            {/* Mobile Currency Selection */}
            <div className="py-3 px-1 border-b border-neutral-800 flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-300">{lang === 'ar' ? 'العملة المفضلة:' : 'Currency:'}</span>
              <div className="flex items-center gap-1.5">
                {(['EGP', 'SAR', 'USD'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCurrencyChange(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currency === c
                        ? 'bg-[#C9A227] text-black shadow-sm font-black'
                        : 'bg-[#141414] text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {c === 'EGP' ? (lang === 'ar' ? 'جنيه (EGP)' : 'EGP') : c === 'SAR' ? (lang === 'ar' ? 'ريال (SAR)' : 'SAR') : 'دولار ($)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Links Stack with large typography and thin gold dividers */}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="flex items-center justify-between py-3.5 text-base sm:text-lg font-bold text-white font-serif hover:text-[#C9A227] transition-colors border-b border-[#C9A227]/20 group active:bg-[#141414]/50 rounded-lg px-2"
              >
                <span>{link.label}</span>
                <ArrowIcon className="w-4 h-4 text-[#C9A227] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            ))}

            {/* Mobile Actions: Order CTA & Direct WhatsApp */}
            <div className="pt-6 space-y-3">
              <a
                href="#order-form"
                onClick={(e) => handleLinkClick(e, '#order-form')}
                className="w-full py-4 text-center text-sm font-extrabold text-black bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] rounded-xl shadow-[0_0_25px_rgba(201,162,39,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.orderNow}</span>
              </a>

              <a
                href="https://wa.me/201033615727"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 text-center text-xs font-bold text-white bg-[#141414] hover:bg-[#1A1A1A] border border-[#25D366]/40 hover:border-[#25D366] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>واتساب مباشر: +20 103 361 5727</span>
              </a>
            </div>

          </div>

          {/* Bottom Drawer Footer */}
          <div className="p-6 bg-[#070707] border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
            <span className="text-[11px]">
              {lang === 'ar' ? 'اضغط أي رابط أو زر X للإغلاق' : 'Click any link or X to close'}
            </span>
            <button
              type="button"
              onClick={onToggleLang}
              className="text-[#C9A227] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
