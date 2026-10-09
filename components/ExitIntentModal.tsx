'use client';

import React, { useState, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { X, MessageCircle, Phone, Sparkles } from 'lucide-react';

interface ExitIntentModalProps {
  lang: Language;
}

export default function ExitIntentModal({ lang }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang].exitPopup;

  const dismiss = React.useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('mk_exit_popup_seen', 'true');
  }, []);

  useEffect(() => {
    // Check if dismissed before
    const hasSeen = localStorage.getItem('mk_exit_popup_seen');
    if (hasSeen === 'true') return;

    // 15 seconds timer
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    // Desktop exit-intent (mouse leaving viewport at the top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !localStorage.getItem('mk_exit_popup_seen')) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  if (!isOpen) return null;

  const defaultMsg = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً مبارك! أرغب في استشارة سريعة حول أفضل باقة تناسب متجري.'
      : 'Hello Mobarak! I would like a quick consultation about the ideal package for my store.'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-300">
      
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={dismiss} />

      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#141414] border-2 border-[#C9A227]/60 p-6 sm:p-8 shadow-2xl z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        <button
          onClick={dismiss}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] border border-[#C9A227]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
            {lang === 'ar' ? 'استشارة مجانية 100%' : '100% Free Consultation'}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2 leading-snug">
          {t.title}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
          {t.subtitle}
        </p>

        <div className="space-y-3">
          <a
            href={`https://wa.me/201033615727?text=${defaultMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.directWa}</span>
          </a>

          <a
            href="tel:00201033615727"
            onClick={dismiss}
            className="w-full py-3 px-4 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-all"
          >
            <Phone className="w-4 h-4 text-[#C9A227]" />
            <span>{t.callNow} (00201033615727)</span>
          </a>

          <button
            type="button"
            onClick={dismiss}
            className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
          >
            {t.dismiss}
          </button>
        </div>

      </div>
    </div>
  );
}
