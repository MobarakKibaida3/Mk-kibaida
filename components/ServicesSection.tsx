'use client';

import React, { useState, useMemo } from 'react';
import { translations } from '@/lib/translations';
import { Language, ServiceCategory, ServiceItem, CurrencyCode } from '@/lib/types';
import { formatPriceWithCurrency } from '@/lib/currency';
import { 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Palette, 
  Share2, 
  Image as ImageIcon, 
  Play, 
  Video, 
  Film, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CheckCircle2,
  Search,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
  services: ServiceItem[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  currency?: CurrencyCode;
}

export default function ServicesSection({
  lang,
  services,
  selectedServiceId,
  onSelectService,
  currency = 'EGP',
}: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'all'>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[lang].services;
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const isSearching = searchQuery.trim().length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter services by name, keywords, and active tab
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = 
        !isSearching ||
        s.nameAr.toLowerCase().includes(normalizedQuery) ||
        s.nameEn.toLowerCase().includes(normalizedQuery) ||
        (s.highlightsAr && s.highlightsAr.some(h => h.toLowerCase().includes(normalizedQuery))) ||
        (s.highlightsEn && s.highlightsEn.some(h => h.toLowerCase().includes(normalizedQuery)));

      const matchesTab = activeTab === 'all' || s.category === activeTab;

      return matchesTab && matchesSearch;
    });
  }, [services, isSearching, normalizedQuery, activeTab]);

  // Icon mapping according to service purpose
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'ai-products-store':
        return <Sparkles className="w-5 h-5 text-[#C9A227]" />;
      case 'shopify-theme':
      case 'turnkey-shopify-setup':
        return <ShoppingBag className="w-5 h-5 text-[#C9A227]" />;
      case 'full-store-bundle':
        return <Layers className="w-5 h-5 text-[#C9A227]" />;
      case 'logo-design':
      case 'full-branding-package':
        return <Palette className="w-5 h-5 text-[#C9A227]" />;
      case 'facebook-posts':
      case 'social-content-package':
        return <Share2 className="w-5 h-5 text-[#C9A227]" />;
      case 'facebook-covers':
      case 'ad-creatives':
      case 'product-mockups-ai':
        return <ImageIcon className="w-5 h-5 text-[#C9A227]" />;
      case 'animated-logo':
        return <Play className="w-5 h-5 text-[#C9A227]" />;
      case 'short-videos':
      case 'product-short-10s':
        return <Video className="w-5 h-5 text-[#C9A227]" />;
      case 'ai-videos':
        return <Film className="w-5 h-5 text-[#C9A227]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#C9A227]" />;
    }
  };

  const handleOrderClick = (serviceId: string) => {
    onSelectService(serviceId);
    const formElement = document.getElementById('order-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] mb-3">
            {lang === 'ar' ? 'كتالوج الخدمات والتسعير' : 'SERVICE CATALOG & RATES'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif mb-4 tracking-tight leading-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Search Bar & Category Controls Container */}
        <div className="max-w-4xl mx-auto mb-12 space-y-5">
          
          {/* Dedicated Luxury Search Input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-[#C9A227]">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              autoFocus={false}
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث عن خدمة بالاسم (مثل: شوبيفاي، هوية بصرية، لوجو، فيديو، إعلانات...)'
                  : 'Search services by name (e.g. Shopify, Branding, Logo, Video, Mockups...)'
              }
              className="w-full ps-12 pe-11 py-3.5 sm:py-4 rounded-2xl bg-[#141414] border border-neutral-800 text-white placeholder-neutral-500 text-sm sm:text-base focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/50 focus:outline-none shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all"
            />

            {/* Clear Search Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 flex items-center pe-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                aria-label={lang === 'ar' ? 'مسح البحث' : 'Clear search'}
              >
                <div className="p-1 rounded-full bg-neutral-800 hover:bg-neutral-700">
                  <X className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>

          {/* Filtering Tabs & Results Count */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Segmented Control */}
            <div className="inline-flex p-1.5 rounded-xl bg-[#141414] border border-neutral-800 self-center sm:self-auto">
              <button
                onClick={() => setActiveTab('core')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'core'
                    ? 'bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.tabCore}
              </button>
              <button
                onClick={() => setActiveTab('extended')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'extended'
                    ? 'bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.tabExtended}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'جميع الخدمات' : 'All Services'}
              </button>
            </div>

            {/* Results Count Tag */}
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>
                {lang === 'ar' 
                  ? `عرض ${filteredServices.length} من ${services.length} خدمة` 
                  : `Showing ${filteredServices.length} of ${services.length} services`}
              </span>
              {isSearching && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('core');
                  }}
                  className="ms-2 text-[11px] text-[#C9A227] hover:underline cursor-pointer"
                >
                  {lang === 'ar' ? '(إعادة ضبط)' : '(Reset)'}
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Empty State when no results match search query */}
        {filteredServices.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-[#141414] border border-neutral-800/80 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] border border-[#C9A227]/30 text-[#C9A227] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif mb-2">
              {lang === 'ar' ? 'لم يتم العثور على خدمات مطابقة' : 'No matching services found'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              {lang === 'ar'
                ? `لم نجد نتائج مطابقة لـ "${searchQuery}". جرب البحث بكلمة مختلفة مثل "شوبيفاي" أو تصفح كل الخدمات.`
                : `No services found matching "${searchQuery}". Try searching with terms like "Shopify" or browse all services.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-black text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'مسح كلمة البحث' : 'Clear Search'}
              </button>
            </div>
          </div>
        ) : (
          /* Services Grid (1 col mobile, 2-3 cols desktop) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceId === service.id;
              const name = lang === 'ar' ? service.nameAr : service.nameEn;
              const desc = lang === 'ar' ? service.descriptionAr : service.descriptionEn;
              const duration = lang === 'ar' ? service.durationAr : service.durationEn;
              const unit = lang === 'ar' ? service.unitAr : service.unitEn;
              const highlights = lang === 'ar' ? service.highlightsAr : service.highlightsEn;

              return (
                <div
                  key={service.id}
                  className={`group relative rounded-2xl bg-[#141414] border transition-all duration-300 p-6 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#C9A227] ring-1 ring-[#C9A227] shadow-[0_0_30px_rgba(201,162,39,0.2)] bg-[#17150F]'
                      : 'border-neutral-800/80 hover:border-[#C9A227]/40 hover:bg-[#181818]'
                  }`}
                >
                  {/* Top Row: Service Number & Icon & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#C9A227]/30 flex items-center justify-center shrink-0 group-hover:border-[#C9A227] transition-colors">
                          {getServiceIcon(service.id)}
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          #{String(service.number).padStart(2, '0')}
                        </span>
                      </div>

                      {service.badge && (
                        <span className="text-[11px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-0.5 rounded border border-[#C9A227]/30">
                          {lang === 'ar' ? service.badge : (service.badgeEn || service.badge)}
                        </span>
                      )}
                    </div>

                    {/* Service Title */}
                    <h3 className="text-lg font-bold text-white font-serif mb-2 leading-snug group-hover:text-[#E5C158] transition-colors">
                      {name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5">
                      {desc}
                    </p>

                    {/* Highlights if any */}
                    {highlights && highlights.length > 0 && (
                      <div className="space-y-1.5 mb-5 pb-5 border-b border-neutral-800/80">
                        {highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-[#C9A227] mt-0.5 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Metadata & Price & Action Button */}
                  <div className="pt-2">
                    
                    {/* Clean unboxed metadata with bullet separators */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C9A227]" />
                        <span>{duration}</span>
                      </div>
                      {unit && (
                        <>
                          <span aria-hidden="true" className="text-neutral-600">·</span>
                          <span className="text-neutral-400 truncate">{unit}</span>
                        </>
                      )}
                    </div>

                    {/* Price & Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                          {formatPriceWithCurrency(service.price, currency, lang).name}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-white font-mono tabular-nums">
                            {formatPriceWithCurrency(service.price, currency, lang).amountString}
                          </span>
                          <span className="text-xs text-[#E5C158] font-bold">
                            {formatPriceWithCurrency(service.price, currency, lang).symbol}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOrderClick(service.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#C9A227] text-black shadow-md'
                            : 'bg-[#1F1F1F] hover:bg-[#C9A227] text-neutral-200 hover:text-black border border-neutral-700 hover:border-[#C9A227]'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'تم الاختيار' : 'Selected'}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.orderService}</span>
                            <ArrowIcon className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
