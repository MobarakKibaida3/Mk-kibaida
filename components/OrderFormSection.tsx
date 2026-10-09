'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { translations } from '@/lib/translations';
import { Language, ServiceItem, CurrencyCode } from '@/lib/types';
import { getServiceQuestions, convertPrice, formatPriceWithCurrency, getCurrencyConfig } from '@/lib/currency';
import { 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  FileText,
  AlertCircle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface OrderFormSectionProps {
  lang: Language;
  services: ServiceItem[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  currency?: CurrencyCode;
}

export default function OrderFormSection({
  lang,
  services,
  selectedServiceId,
  onSelectService,
  currency = 'EGP',
}: OrderFormSectionProps) {
  const t = translations[lang].orderForm;
  const sm = translations[lang].successModal;

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(selectedServiceId || 'full-store-bundle');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [details, setDetails] = useState('');
  const [coupon, setCoupon] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam hidden field

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState<{
    orderCode: string;
    whatsappUrl: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync selectedServiceId prop
  useEffect(() => {
    if (selectedServiceId && selectedServiceId !== serviceId) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  const currentService = services.find((s) => s.id === serviceId) || services[0];
  const servicePriceEGP = currentService?.price || 0;

  // Get service-specific customization questions from settings.json
  const serviceQuestions = useMemo(() => {
    return getServiceQuestions(serviceId);
  }, [serviceId]);

  // Pricing conversions based on currency
  const currencyConfig = getCurrencyConfig(currency);
  const isCouponValid = coupon.trim().toUpperCase() === 'MK2026' || coupon.trim().toUpperCase() === 'VIP';

  const baseConvertedPrice = convertPrice(servicePriceEGP, currency).amount;
  const discountConverted = isCouponValid ? Math.round(baseConvertedPrice * 0.1) : 0;
  const finalConvertedPrice = baseConvertedPrice - discountConverted;
  const priceMeta = formatPriceWithCurrency(servicePriceEGP, currency, lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot check
    if (honeypot) {
      return;
    }

    if (fullName.trim().length < 2) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال الاسم الكامل (حرفان على الأقل).' : 'Full name must be at least 2 characters.');
      return;
    }

    if (phone.trim().length < 6) {
      setErrorMsg(lang === 'ar' ? 'يرجى كتابة رقم هاتف / واتساب صالح.' : 'Valid phone/WhatsApp number is required.');
      return;
    }

    if (details.trim().length < 5) {
      setErrorMsg(lang === 'ar' ? 'يرجى كتابة نبذة أو تفاصيل إضافية لمشروعك (5 أحرف على الأقل).' : 'Please describe your project (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);

    // Format custom service answers
    const answersText = serviceQuestions
      .map((q) => {
        const ans = customAnswers[q.id]?.trim();
        if (!ans) return null;
        const qTitle = lang === 'ar' ? q.questionAr : q.questionEn;
        return `▪ ${qTitle}: ${ans}`;
      })
      .filter(Boolean)
      .join('\n');

    const combinedDetails = answersText 
      ? `أسئلة الخدمة التخصيصية:\n${answersText}\n\nتفاصيل ومتطلبات إضافية:\n${details.trim()}`
      : details.trim();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          countryCode,
          email,
          serviceId: currentService.id,
          serviceNameAr: currentService.nameAr,
          serviceNameEn: currentService.nameEn,
          price: baseConvertedPrice,
          discountCode: coupon,
          finalPrice: finalConvertedPrice,
          currencyCode: currency,
          currencyName: lang === 'ar' ? currencyConfig.nameAr : currencyConfig.nameEn,
          currencySymbol: lang === 'ar' ? currencyConfig.symbolAr : currencyConfig.symbolEn,
          details: combinedDetails,
          customAnswers: answersText,
          source: 'direct_form',
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      setSuccessOrder({
        orderCode: data.order.orderCode,
        whatsappUrl: data.whatsappUrl,
      });

      // Automatically launch WhatsApp in new tab
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const countryCodes = [
    { code: '+20', label: '🇪🇬 مصر (+20)' },
    { code: '+966', label: '🇸🇦 السعودية (+966)' },
    { code: '+971', label: '🇦🇪 الإمارات (+971)' },
    { code: '+965', label: '🇰🇼 الكويت (+965)' },
    { code: '+974', label: '🇶🇦 قطر (+974)' },
    { code: '+968', label: '🇴🇲 عمان (+968)' },
    { code: '+973', label: '🇧🇭 البحرين (+973)' },
    { code: '+962', label: '🇯🇴 الأردن (+962)' },
    { code: '+1', label: '🇺🇸 أمريكا / كندا (+1)' },
    { code: '+44', label: '🇬🇧 بريطانيا (+44)' },
  ];

  return (
    <section id="order-form" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] mb-3">
            {lang === 'ar' ? 'طلب فوري ومباشر' : 'INSTANT ORDER FORM'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif mb-4 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-[#141414] border border-neutral-800 p-6 sm:p-10 shadow-2xl relative">
            
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Anti-spam Honeypot field (hidden from genuine users) */}
              <input
                type="text"
                name="website_url_check"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:border-[#C9A227] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    {t.phoneLabel} <span className="text-[#C9A227]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs font-mono focus:border-[#C9A227] focus:outline-none cursor-pointer"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-500 text-sm font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  {t.serviceLabel}
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    onSelectService(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-sm focus:border-[#C9A227] focus:outline-none transition-colors cursor-pointer"
                >
                  {services.map((s) => {
                    const priceItem = formatPriceWithCurrency(s.price, currency, lang);
                    return (
                      <option key={s.id} value={s.id}>
                        {lang === 'ar' ? s.nameAr : s.nameEn} ({priceItem.fullLabel})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Dynamic Service-Specific Customization Questions (from settings.json) */}
              {serviceQuestions.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0D0D] border border-[#C9A227]/30 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A227]" />
                      <span className="text-xs sm:text-sm font-bold text-[#E5C158] font-serif">
                        {lang === 'ar' ? 'بيانات تخصيص الخدمة المحددة' : 'Service Customization Details'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {serviceQuestions.length} {lang === 'ar' ? 'أسئلة قصيرة' : 'questions'}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {serviceQuestions.map((q) => (
                      <div key={q.id}>
                        <label className="block text-xs font-medium text-neutral-200 mb-1.5">
                          {lang === 'ar' ? q.questionAr : q.questionEn}
                          {q.required ? (
                            <span className="text-[#C9A227] ms-1 font-bold">*</span>
                          ) : (
                            <span className="text-neutral-500 ms-1.5 text-[10px]">
                              {lang === 'ar' ? '(اختياري)' : '(Optional)'}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={customAnswers[q.id] || ''}
                          onChange={(e) => setCustomAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={lang === 'ar' ? q.placeholderAr : q.placeholderEn}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#070707] border border-neutral-800 text-white placeholder-neutral-600 text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details textarea with Live Character Counter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-300">
                    {t.detailsLabel}
                  </label>
                  <span className={`text-[11px] font-mono ${details.length < 5 ? 'text-amber-500' : 'text-neutral-400'}`}>
                    {details.length} / 5 {lang === 'ar' ? 'حروف كحد أدنى' : 'min chars'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={t.detailsPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:border-[#C9A227] focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Optional Email & Coupon Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:border-[#C9A227] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    {t.couponLabel}
                  </label>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t.couponPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-500 text-sm uppercase font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
                  />
                  {isCouponValid && (
                    <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
                      ✓ {lang === 'ar' ? 'كود خصم فعال! تم تطبيق خصم 10%' : 'Valid coupon! 10% discount applied'}
                    </span>
                  )}
                </div>
              </div>

              {/* Friendly Note on File Uploads via WhatsApp */}
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-neutral-800 flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">
                    {t.filesNoteTitle}
                  </span>
                  <span>{t.filesNoteBody}</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-sm sm:text-base font-extrabold text-black bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-[#FFFFFF] hover:to-[#E5C158] disabled:opacity-50 rounded-xl shadow-[0_0_30px_rgba(201,162,39,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isSubmitting ? (
                  <span>{t.submitting}</span>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>{t.submitBtn}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-neutral-400">
                  {t.privacyBadge}
                </span>
              </div>

            </form>

          </div>

          {/* Sidebar Summary & Direct Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Service Summary Card */}
            <div className="rounded-2xl bg-[#141414] border border-[#C9A227]/40 p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227] block mb-3 font-serif">
                {t.summaryCardTitle}
              </span>

              <h4 className="text-base font-bold text-white font-serif mb-2">
                {lang === 'ar' ? currentService.nameAr : currentService.nameEn}
              </h4>

              <p className="text-xs text-neutral-400 mb-4 line-clamp-3">
                {lang === 'ar' ? currentService.descriptionAr : currentService.descriptionEn}
              </p>

              <div className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{lang === 'ar' ? 'مدة التنفيذ المتوقعة:' : 'Turnaround:'}</span>
                  <span className="text-white font-medium">
                    {lang === 'ar' ? currentService.durationAr : currentService.durationEn}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{lang === 'ar' ? 'السعر الأساسي:' : 'Base Rate:'}</span>
                  <span className="font-mono tabular-nums text-white">
                    {baseConvertedPrice.toLocaleString()} {priceMeta.symbol}
                  </span>
                </div>

                {isCouponValid && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>{lang === 'ar' ? 'خصم الكوبون (10%):' : 'Coupon Discount (10%):'}</span>
                    <span className="font-mono tabular-nums">
                      -{discountConverted.toLocaleString()} {priceMeta.symbol}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-800">
                  <span className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'السعر الإجمالي:' : 'Total Due:'}
                  </span>
                  <div>
                    <span className="text-2xl font-black text-[#E5C158] font-mono tabular-nums">
                      {finalConvertedPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-400 mr-1 ml-1 font-bold">
                      {priceMeta.symbol} ({priceMeta.name})
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Contact Cards */}
            <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block font-serif">
                {t.directContactNotice}
              </span>

              <a
                href="https://wa.me/201033615727"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0D0D] border border-neutral-800 hover:border-[#25D366]/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">واتساب مباشر</span>
                  <span className="text-xs font-bold text-white font-mono dir-ltr block text-left">
                    +20 103 361 5727
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#25D366]" />
              </a>

              <a
                href="mailto:Mobarakkibaida3@gmail.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0D0D] border border-neutral-800 hover:border-[#C9A227]/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">البريد الإلكتروني</span>
                  <span className="text-xs font-medium text-white truncate block">
                    Mobarakkibaida3@gmail.com
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#C9A227]" />
              </a>

              <a
                href="tel:00201033615727"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0D0D] border border-neutral-800 hover:border-neutral-700 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">اتصال هاتفي</span>
                  <span className="text-xs font-mono text-white dir-ltr block text-left">
                    00201033615727
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
              </a>
            </div>

            {/* Satisfaction Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#C9A227]/30 flex items-center gap-3 text-xs text-neutral-300">
              <ShieldCheck className="w-6 h-6 text-[#C9A227] shrink-0" />
              <span>
                {lang === 'ar' 
                  ? 'ضمان جودة وتعديلات حتى الرضا التام، وبدون دفع مسبق في الموقع.' 
                  : 'Satisfaction guarantee with revisions included. Zero advance payment.'}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-3xl bg-[#141414] border-2 border-[#C9A227] p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227] mx-auto flex items-center justify-center text-[#C9A227] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-serif mb-2">
              {sm.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
              {sm.subtitle}
            </p>

            {/* Order Code Highlight */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#C9A227]/40 mb-6 flex items-center justify-between">
              <div className="text-start">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  {sm.orderCodeLabel}
                </span>
                <span className="text-xl font-black font-mono text-[#E5C158]">
                  #{successOrder.orderCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(successOrder.orderCode)}
                className="px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] text-neutral-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? sm.codeCopied : sm.copyCode}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <a
                href={successOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-black" />
                <span>{sm.openWaBtn}</span>
              </a>

              <button
                type="button"
                onClick={() => setSuccessOrder(null)}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {sm.closeBtn}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
