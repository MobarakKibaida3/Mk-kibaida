'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { Sparkles, Eye, X, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PortfolioSectionProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

interface PortfolioItem {
  id: string;
  category: 'stores' | 'ai' | 'branding' | 'videos';
  titleAr: string;
  titleEn: string;
  clientAr: string;
  clientEn: string;
  descAr: string;
  descEn: string;
  metricAr: string;
  metricEn: string;
  image: string;
  serviceIdToLink: string;
}

export default function PortfolioSection({ lang, onSelectService }: PortfolioSectionProps) {
  const [filter, setFilter] = useState<'all' | 'stores' | 'ai' | 'branding' | 'videos'>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const t = translations[lang].portfolio;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const portfolioItems: PortfolioItem[] = [
    {
      id: 'p1',
      category: 'stores',
      titleAr: 'متجر دار النخبة للساعات الفاخرة',
      titleEn: 'Elite Horology Luxury Watch Boutique',
      clientAr: 'علامة تجارية سعودية بالرياض',
      clientEn: 'Luxury Brand in Riyadh, KSA',
      descAr: 'تصميم وبرمجة ثيم شوبيفاي فائق السرعة باللونين الأسود والذهبي مع صفحات تفاصيل غامرة زادت معدل التحويل بنسبة 85%.',
      descEn: 'High-speed bespoke Shopify theme with cinematic product storytelling, boosting conversion rates by +85%.',
      metricAr: '+85% نمو في المبيعات',
      metricEn: '+85% Conversion Growth',
      image: '/images/portfolio_shopify_theme_1791020887336.jpg',
      serviceIdToLink: 'shopify-theme',
    },
    {
      id: 'p2',
      category: 'ai',
      titleAr: 'مجموعة مستحضرات التجميل العضوية بالـAI',
      titleEn: 'Organic Botanical Cosmetics AI Product Series',
      clientAr: 'براند عناية رائد في القاهرة',
      clientEn: 'Leading Skincare Brand in Cairo',
      descAr: 'توليد 18 مشهداً تسويقياً سينمائياً للمنتجات باستخدام الذكاء الاصطناعي دون الحاجة لاستئجار استوديو باهظ الثمن.',
      descEn: 'Generated 18 hyper-realistic studio product visuals eliminating expensive set rental while boosting ad CTR.',
      metricAr: 'وفر 70% من تكاليف التصوير',
      metricEn: '70% Cost Reduction vs Studio',
      image: '/images/portfolio_ai_product_1791020875988.jpg',
      serviceIdToLink: 'ai-products-store',
    },
    {
      id: 'p3',
      category: 'branding',
      titleAr: 'الهوية الملكية الكاملة لمجموعة كبيدة',
      titleEn: 'Royal Monogram Brand Identity Suite',
      clientAr: 'استوديو التصميم والاستشارات الفاخرة',
      clientEn: 'Luxury Consultancy & Creative Practice',
      descAr: 'تصميم لوجو التاج الملكي MK، كروت الأعمال المطبوعة بورق أسود مطفي مع بصمة ذهبية بارزة، وتوحيد كامل ملفات السوشيال.',
      descEn: 'Bespoke crown monogram logo, premium foil-stamped business stationery, and social launch collateral.',
      metricAr: 'هوية متكاملة 100%',
      metricEn: '100% Vector & Brand Kit',
      image: '/images/portfolio_brand_identity_1791020898142.jpg',
      serviceIdToLink: 'logo-design',
    },
    {
      id: 'p4',
      category: 'videos',
      titleAr: 'حملة ريلز وشورتس للمنتجات الحصرية',
      titleEn: 'Viral Vertical Reels Campaign for Products',
      clientAr: 'متجر أزياء وإكسسوارات تريند',
      clientEn: 'Trending Fashion & Accessories Brand',
      descAr: 'سلسلة فيديوهات 10 ثوانٍ بمؤثرات بصرية سريعة وهُوك بصري محكم حصدت أكثر من 450 ألف مشاهدة عضوية وتفاعل قياسي.',
      descEn: 'Fast-paced 10-second product hooks engineered for viral engagement, generating over 450k organic views.',
      metricAr: '+450K مشاهدة ريلز',
      metricEn: '+450K Organic Impressions',
      image: '/images/portfolio_social_video_1791020909507.jpg',
      serviceIdToLink: 'product-short-10s',
    },
  ];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter((i) => i.category === filter);

  const handleOrderThisStyle = (serviceId: string) => {
    setActiveModalItem(null);
    onSelectService(serviceId);
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] mb-3">
            {lang === 'ar' ? 'أعمال تم تنفيذها بحرفية' : 'PROVEN CASE STUDIES'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif mb-4">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>

          {/* Clean Segmented Filter Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-[#141414] border border-neutral-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-[#C9A227] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilter('stores')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'stores'
                  ? 'bg-[#C9A227] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterStores}
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'ai'
                  ? 'bg-[#C9A227] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterAi}
            </button>
            <button
              onClick={() => setFilter('branding')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'branding'
                  ? 'bg-[#C9A227] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterBranding}
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === 'videos'
                  ? 'bg-[#C9A227] text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.filterVideos}
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => {
            const title = lang === 'ar' ? item.titleAr : item.titleEn;
            const client = lang === 'ar' ? item.clientAr : item.clientEn;
            const desc = lang === 'ar' ? item.descAr : item.descEn;
            const metric = lang === 'ar' ? item.metricAr : item.metricEn;

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-[#141414] border border-neutral-800 hover:border-[#C9A227]/50 overflow-hidden transition-all duration-300 flex flex-col shadow-lg"
              >
                {/* Visual Asset Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => setActiveModalItem(item)}>
                  <Image
                    src={item.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Proof Metric Tag */}
                  <div className="absolute top-4 right-4 bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C9A227]/40 text-xs font-bold text-[#E5C158] font-mono">
                    {metric}
                  </div>

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#C9A227] text-black flex items-center justify-center shadow-xl">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata Line */}
                    <div className="text-xs text-neutral-400 mb-2 flex items-center gap-2">
                      <span>{client}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-serif mb-2.5 group-hover:text-[#E5C158] transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="text-xs text-neutral-300 hover:text-white inline-flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
                      <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                    </button>

                    <button
                      onClick={() => handleOrderThisStyle(item.serviceIdToLink)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C9A227]/10 hover:bg-[#C9A227] text-[#C9A227] hover:text-black border border-[#C9A227]/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'طلب تصميم مماثل' : 'Order Similar'}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox / Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#141414] border border-[#C9A227]/50 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white z-10 cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-6 bg-neutral-900 border border-neutral-800">
              <Image
                src={activeModalItem.image}
                alt={lang === 'ar' ? activeModalItem.titleAr : activeModalItem.titleEn}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-[#C9A227]/10 text-[#C9A227] text-xs font-bold font-mono mb-3 border border-[#C9A227]/30">
              {lang === 'ar' ? activeModalItem.metricAr : activeModalItem.metricEn}
            </div>

            <h3 className="text-2xl font-bold text-white font-serif mb-2">
              {lang === 'ar' ? activeModalItem.titleAr : activeModalItem.titleEn}
            </h3>

            <p className="text-xs text-neutral-400 mb-4">
              {lang === 'ar' ? activeModalItem.clientAr : activeModalItem.clientEn}
            </p>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {lang === 'ar' ? activeModalItem.descAr : activeModalItem.descEn}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => handleOrderThisStyle(activeModalItem.serviceIdToLink)}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black font-bold text-sm shadow-md hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'ar' ? 'طلب هذا النموذج لمشروعي' : 'Order This Style For My Project'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveModalItem(null)}
                className="py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
