'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Language } from '@/lib/types';

interface FloatingWhatsAppProps {
  lang: Language;
}

export default function FloatingWhatsApp({ lang }: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show gentle prompt tooltip after 4 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const defaultMsg = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً مبارك! أرغب في الاستفسار عن باقات وخدمات التصميم.'
      : 'Hello Mobarak! I would like to inquire about your design packages.'
  );

  return (
    // Hidden on mobile (sm:flex only) because MobileBottomBar handles mobile
    <div className="hidden sm:flex fixed bottom-6 left-6 z-40 items-center gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-[#141414] border border-[#C9A227]/40 shadow-2xl text-xs text-white animate-in fade-in slide-in-from-left-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span className="font-medium">
            {lang === 'ar' ? 'تحدث مع مبارك مباشرة الآن' : 'Chat with Mobarak directly'}
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-white p-0.5 ml-1 mr-1"
            aria-label="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button with WhatsApp Glow */}
      <a
        href={`https://wa.me/201033615727?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_0_25px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all"
        aria-label="تواصل عبر واتساب"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />
        <MessageCircle className="w-7 h-7 relative z-10 fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9A227] border-2 border-black flex items-center justify-center text-[9px] font-bold text-black">
          1
        </span>
      </a>
    </div>
  );
}
