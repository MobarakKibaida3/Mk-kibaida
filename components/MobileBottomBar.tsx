'use client';

import React from 'react';
import { MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { Language } from '@/lib/types';

interface MobileBottomBarProps {
  lang: Language;
}

export default function MobileBottomBar({ lang }: MobileBottomBarProps) {
  const isRtl = lang === 'ar';

  const defaultMsg = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً مبارك! أرغب في الاستفسار والاتفاق على باقة تصميم لمتجري.'
      : 'Hello Mobarak! I would like to inquire about a design package for my store.'
  );

  const handleOrderClick = () => {
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#C9A227]/30 px-3 py-2.5 flex items-center gap-2 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] pb-[max(0.625rem,env(safe-area-inset-bottom))]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Primary Order Button */}
      <button
        type="button"
        onClick={handleOrderClick}
        className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#C9A227] to-[#A38018] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(201,162,39,0.3)] active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
      >
        <ShoppingBag className="w-4 h-4 text-black" />
        <span>{lang === 'ar' ? 'اطلب الآن' : 'Order Now'}</span>
      </button>

      {/* WhatsApp Direct Action Button */}
      <a
        href={`https://wa.me/201033615727?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.3)] active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
      >
        <MessageCircle className="w-4 h-4 fill-black text-[#25D366]" />
        <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
      </a>
    </div>
  );
}
