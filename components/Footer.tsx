'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import MkLogo from './MkLogo';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { MessageCircle, Mail, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;
  const router = useRouter();
  const clickTimestampsRef = useRef<number[]>([]);

  // Secret 5 clicks within 2 seconds on MK Logo triggers admin portal
  const handleSecretLogoClick = () => {
    const now = Date.now();
    const recentClicks = [...clickTimestampsRef.current.filter((ts) => now - ts <= 2000), now];
    clickTimestampsRef.current = recentClicks;

    if (recentClicks.length >= 5) {
      clickTimestampsRef.current = [];
      router.push('/admin-mk-x7');
    }
  };

  return (
    <footer className="bg-[#070707] border-t border-[#C9A227]/20 pt-16 pb-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={handleSecretLogoClick} 
              className="inline-block cursor-default select-none active:scale-[0.99] transition-transform"
              role="button"
              tabIndex={-1}
              aria-label="MK Logo"
            >
              <MkLogo size="md" showSubtitle={true} />
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm pt-2">
              {t.about}
            </p>
            <div className="flex items-center gap-2 text-neutral-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>{lang === 'ar' ? 'التسليم بأعلى دقة ومعايير الاحترافية' : 'Delivered with bespoke precision'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm font-serif">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-[#C9A227] transition-colors">
                  {lang === 'ar' ? 'الخدمات والأسعار' : 'Services & Rates'}
                </a>
              </li>
              <li>
                <a href="#featured-offer" className="hover:text-[#C9A227] transition-colors">
                  {lang === 'ar' ? 'باقة المتجر الكامل (عرض 6,000)' : 'Turnkey Store Bundle'}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#C9A227] transition-colors">
                  {lang === 'ar' ? 'معرض الأعمال' : 'Portfolio'}
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#C9A227] transition-colors">
                  {lang === 'ar' ? 'حاسبة الباقات' : 'Price Calculator'}
                </a>
              </li>
              <li>
                <a href="#tracker" className="hover:text-[#C9A227] transition-colors">
                  {lang === 'ar' ? 'تتبع حالة طلبك' : 'Track Order Status'}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm font-serif">
              {t.contactInfo}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/201033615727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] font-mono transition-colors dir-ltr text-left"
                >
                  +20 103 361 5727
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a
                  href="mailto:Mobarakkibaida3@gmail.com"
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Mobarakkibaida3@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a
                  href="tel:00201033615727"
                  className="hover:text-white font-mono transition-colors dir-ltr text-left"
                >
                  00201033615727
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-center sm:text-start">
          <p>{t.copyright}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{lang === 'ar' ? 'تصميم مخصص · بدون عمولات خفية' : 'Bespoke Design · Zero Hidden Fees'}</span>
            <span aria-hidden="true">·</span>
            <span>Cairo / Riyadh / Dubai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
