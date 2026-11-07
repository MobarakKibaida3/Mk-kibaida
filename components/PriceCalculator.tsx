'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from '@/lib/translations';
import { 
  Language, 
  CurrencyCode, 
  ServicePricingRule, 
  PriceBreakdown,
  ServiceItem 
} from '@/lib/types';
import { calculateAuthoritativeEstimate } from '@/lib/calculatorEngine';
import { getCurrencyConfig, formatPriceWithCurrency } from '@/lib/currency';
import { 
  Calculator, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Layers,
  Palette,
  Globe,
  ShoppingBag,
  Share2,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Info,
  DollarSign,
  Plus,
  Minus,
  RotateCcw,
  Send
} from 'lucide-react';

interface PriceCalculatorProps {
  lang: Language;
  services?: ServiceItem[];
  currency?: CurrencyCode;
}

export default function PriceCalculator({
  lang,
  currency = 'EGP',
}: PriceCalculatorProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackArrowIcon = isRtl ? ArrowRight : ArrowLeft;
  const currencyMeta = getCurrencyConfig(currency);

  // Pricing rules state
  const [rules, setRules] = useState<ServicePricingRule[]>([]);
  const [loadingRules, setLoadingRules] = useState(true);

  // Step state (1: Service & Config, 2: Review Breakdown, 3: Contact & Submit)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Customer selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>('shopify-store-dev');
  const [unitsCount, setUnitsCount] = useState<number>(4);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [complexityId, setComplexityId] = useState<string>('standard');
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [preferredDeadline, setPreferredDeadline] = useState<string>('');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [requestModeChoice, setRequestModeChoice] = useState<'estimate' | 'quotation'>('estimate');

  // Contact info
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+20');
  const [email, setEmail] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    orderCode: string;
    whatsappUrl: string;
    isQuotation: boolean;
  } | null>(null);

  // Fetch published rules
  useEffect(() => {
    let isMounted = true;
    const fetchRules = async () => {
      try {
        const res = await fetch('/api/calculator/pricing');
        const data = await res.json();
        if (isMounted && data.rules && Array.isArray(data.rules)) {
          setRules(data.rules);
        }
      } catch (err) {
        console.error('Failed to load calculator pricing:', err);
      } finally {
        if (isMounted) setLoadingRules(false);
      }
    };
    fetchRules();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentRule = useMemo(() => {
    return rules.find((r) => r.serviceId === selectedServiceId) || rules[0];
  }, [rules, selectedServiceId]);

  // Explicit handler for service selection
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const targetRule = rules.find((r) => r.serviceId === serviceId);
    if (targetRule) {
      setUnitsCount(targetRule.baseUnitsIncluded || 1);
      setSelectedFeatures([]);
      setSelectedAdditional([]);
      setComplexityId('standard');
      if (targetRule.mode === 'quotation' || targetRule.basePrice <= 0) {
        setRequestModeChoice('quotation');
      } else {
        setRequestModeChoice('estimate');
      }
    }
  };

  // Effective mode of selected service
  const effectiveMode = useMemo(() => {
    if (!currentRule || !currentRule.enabled) return 'quotation';
    if (currentRule.mode === 'quotation' || currentRule.basePrice <= 0) return 'quotation';
    return currentRule.mode; // 'estimate' or 'hybrid'
  }, [currentRule]);

  // Authoritative synchronous calculation via pure useMemo
  const breakdown: PriceBreakdown | null = useMemo(() => {
    if (!currentRule || effectiveMode === 'quotation') return null;
    const calc = calculateAuthoritativeEstimate(currentRule, {
      serviceId: currentRule.serviceId,
      unitsCount,
      featureIds: selectedFeatures,
      complexityId,
      additionalIds: selectedAdditional,
      currency,
    });
    return calc.breakdown;
  }, [currentRule, effectiveMode, unitsCount, selectedFeatures, complexityId, selectedAdditional, currency]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAdditional = (id: string) => {
    setSelectedAdditional((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUnitChange = (delta: number) => {
    if (!currentRule) return;
    const min = currentRule.minUnits || 1;
    const max = currentRule.maxUnits || 100;
    setUnitsCount((prev) => Math.max(min, Math.min(max, prev + delta)));
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-5 h-5 text-[#C9A227]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-[#C9A227]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-[#C9A227]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C9A227]" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-[#C9A227]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#C9A227]" />;
      default:
        return <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />;
    }
  };

  // Submit Handler
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (honeypot) return;

    if (fullName.trim().length < 2) {
      setSubmitError(lang === 'ar' ? 'يرجى إدخال الاسم الكامل (حرفان على الأقل)' : 'Full name is required (at least 2 chars)');
      return;
    }

    if (phone.trim().length < 6) {
      setSubmitError(lang === 'ar' ? 'يرجى إدخال رقم هاتف / واتساب صالح' : 'Valid phone / WhatsApp number is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/calculator/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          countryCode,
          email,
          serviceId: selectedServiceId,
          unitsCount: currentRule?.hasUnits ? unitsCount : undefined,
          featureIds: selectedFeatures,
          complexityId,
          additionalIds: selectedAdditional,
          currency,
          budgetRange,
          preferredDeadline,
          specialRequirements,
          attachmentUrl,
          pricingModeSelected: requestModeChoice,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit calculator request');
      }

      setSubmissionSuccess({
        orderCode: data.order.orderCode,
        whatsappUrl: data.whatsappUrl,
        isQuotation: data.isQuotation,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="calculator" className="py-20 sm:py-24 bg-[#0A0A0A] relative border-t border-b border-neutral-900 overflow-hidden">
      
      {/* Background radial gold aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[700px] h-[320px] sm:h-[700px] bg-[#C9A227]/5 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/40 text-[#C9A227] text-xs font-bold mb-4 shadow-[0_0_15px_rgba(201,162,39,0.15)]">
            <Calculator className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar' ? 'حاسبة التكلفة الذكية وعروض الأسعار' : 'Smart Cost Calculator & Quotations'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif mb-4 tracking-tight leading-tight">
            {lang === 'ar' ? 'احسب تكلفة مشروعك أو اطلب عرض سعر مخصص' : 'Calculate Your Project Cost or Request a Custom Quote'}
          </h2>

          <p className="text-neutral-400 text-xs sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'اختر الخدمة والمواصفات المطلوبة للاطلاع على تقدير تكلفة فوري أو لطلب عرض سعر مخصص ودقيق لمشروعك، مع شفافية كاملة وبدون تكاليف خفية.'
              : 'Select your desired service and specifications to get an instant cost estimate or submit a tailored quotation request with complete transparency.'}
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-neutral-800 -z-0" />
            <div 
              className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-[#C9A227] transition-all duration-300 -z-0"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                right: isRtl ? (step === 1 ? '100%' : step === 2 ? '50%' : '0%') : undefined,
                left: !isRtl ? (step === 1 ? '0%' : step === 2 ? '50%' : '100%') : undefined,
              }}
            />

            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1.5 z-10 bg-[#0A0A0A] px-2">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                  step >= 1 
                    ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.3)]' 
                    : 'bg-[#141414] text-neutral-400 border-neutral-700'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-bold text-neutral-300">
                {lang === 'ar' ? 'الخدمة والنطاق' : 'Service & Scope'}
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1.5 z-10 bg-[#0A0A0A] px-2">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                  step >= 2 
                    ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.3)]' 
                    : 'bg-[#141414] text-neutral-400 border-neutral-700'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-bold text-neutral-300">
                {lang === 'ar' ? 'التسعير والتفاصيل' : 'Pricing & Scope'}
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1.5 z-10 bg-[#0A0A0A] px-2">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                  step >= 3 
                    ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-[0_0_15px_rgba(201,162,39,0.3)]' 
                    : 'bg-[#141414] text-neutral-400 border-neutral-700'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-neutral-300">
                {lang === 'ar' ? 'التأكيد والطلب' : 'Contact & Submit'}
              </span>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: SERVICE & SCOPE SELECTION ================= */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* 1. Service Cards Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-3">
                {lang === 'ar' ? '1. اختر نوع الخدمة المطلوبة:' : '1. Choose Service Type:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {rules.map((rule) => {
                  const isSelected = selectedServiceId === rule.serviceId;
                  const name = lang === 'ar' ? rule.nameAr : rule.nameEn;
                  const modeBadge = 
                    rule.mode === 'quotation' || rule.basePrice <= 0
                      ? (lang === 'ar' ? 'عرض مخصص' : 'Custom Quote')
                      : rule.mode === 'hybrid'
                      ? (lang === 'ar' ? 'تقدير + عرض' : 'Estimate / Quote')
                      : (lang === 'ar' ? 'تسعير فوري' : 'Instant Estimate');

                  return (
                    <button
                      key={rule.serviceId}
                      type="button"
                      onClick={() => handleSelectService(rule.serviceId)}
                      className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#17150E] border-[#C9A227] shadow-[0_0_20px_rgba(201,162,39,0.2)]'
                          : 'bg-[#121212] border-neutral-800 hover:border-neutral-700 hover:bg-[#151515]'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#C9A227]/20 border border-[#C9A227]' : 'bg-[#0A0A0A] border border-neutral-800'
                        }`}>
                          {getServiceIcon(rule.iconName)}
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          rule.mode === 'quotation' || rule.basePrice <= 0
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                            : 'bg-[#C9A227]/10 text-[#E5C158] border-[#C9A227]/30'
                        }`}>
                          {modeBadge}
                        </span>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm font-bold text-white font-serif mb-1 leading-snug">
                          {name}
                        </h4>
                        <div className="text-[11px] text-neutral-400">
                          {rule.hasUnits ? (
                            <span>
                              {lang === 'ar' 
                                ? `يبدأ من ${rule.baseUnitsIncluded} ${rule.unitLabelAr || ''}`
                                : `Includes ${rule.baseUnitsIncluded} ${rule.unitLabelEn || ''}`}
                            </span>
                          ) : (
                            <span>{lang === 'ar' ? 'نطاق عمل مخصص' : 'Custom Architecture'}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Service Specific Configuration Fields */}
            {currentRule && (
              <div className="rounded-3xl bg-[#121212] border border-neutral-800/90 p-6 sm:p-8 space-y-8 shadow-xl">
                
                {/* Active service header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#C9A227]/40 flex items-center justify-center">
                      {getServiceIcon(currentRule.iconName)}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                        {lang === 'ar' ? currentRule.nameAr : currentRule.nameEn}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {currentRule.mode === 'quotation' || currentRule.basePrice <= 0
                          ? (lang === 'ar' ? 'تخضع هذه الخدمة لتقييم يدوي لإعداد عرض سعر احترافي مخصص.' : 'This service is manually evaluated to provide a tailored quote.')
                          : (lang === 'ar' ? 'تُحسب التكلفة تلقائياً بناءً على القواعد المعتمدة من الإدارة.' : 'Cost is estimated dynamically using administrative rules.')}
                      </p>
                    </div>
                  </div>

                  {/* Mode Badge / Selector if hybrid */}
                  {currentRule.mode === 'hybrid' && (
                    <div className="flex items-center rounded-xl bg-[#0A0A0A] p-1 border border-neutral-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setRequestModeChoice('estimate')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          requestModeChoice === 'estimate'
                            ? 'bg-[#C9A227] text-black shadow-sm font-black'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {lang === 'ar' ? 'تقدير فوري' : 'Instant Estimate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestModeChoice('quotation')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          requestModeChoice === 'quotation'
                            ? 'bg-[#C9A227] text-black shadow-sm font-black'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {lang === 'ar' ? 'طلب عرض مخصص' : 'Custom Quote'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Units Counter Field - ONLY if service has units */}
                {currentRule.hasUnits && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-neutral-200">
                        {lang === 'ar' 
                          ? `عدد ${currentRule.unitLabelAr || 'الوحدات'} المطلوبة:` 
                          : `Number of ${currentRule.unitLabelEn || 'Units'}:`}
                      </label>
                      <span className="text-xs font-mono text-neutral-400">
                        {lang === 'ar' 
                          ? `(السعر الأساسي يشمل ${currentRule.baseUnitsIncluded} مجاناً)` 
                          : `(${currentRule.baseUnitsIncluded} included in base)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 bg-[#0A0A0A] p-2.5 rounded-2xl border border-neutral-800 max-w-sm">
                      <button
                        type="button"
                        onClick={() => handleUnitChange(-1)}
                        disabled={unitsCount <= (currentRule.minUnits || 1)}
                        className="w-10 h-10 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
                        aria-label="Decrease units"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex-1 text-center font-mono text-xl font-bold text-[#E5C158]">
                        {unitsCount}{' '}
                        <span className="text-xs text-neutral-400 font-sans">
                          {lang === 'ar' ? currentRule.unitLabelAr : currentRule.unitLabelEn}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUnitChange(1)}
                        disabled={unitsCount >= (currentRule.maxUnits || 100)}
                        className="w-10 h-10 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
                        aria-label="Increase units"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Complexity Selector */}
                {currentRule.complexityOptions && currentRule.complexityOptions.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-200 mb-3">
                      {lang === 'ar' ? 'مستوى تعقيد وتفاصيل المشروع:' : 'Project Complexity Level:'}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentRule.complexityOptions.map((opt) => {
                        const isSelected = complexityId === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setComplexityId(opt.id)}
                            className={`p-3.5 rounded-xl border text-start cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#19160E] border-[#C9A227] text-white shadow-md'
                                : 'bg-[#0A0A0A] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold">
                                {lang === 'ar' ? opt.nameAr.split('—')[0] : opt.nameEn.split('—')[0]}
                              </span>
                              <span className="text-[10px] font-mono text-[#E5C158]">
                                {opt.multiplier}x
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-2">
                              {lang === 'ar' ? opt.nameAr : opt.nameEn}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Features Checklist (Only relevant to selected service) */}
                {currentRule.features && currentRule.features.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-200 mb-3">
                      {lang === 'ar' ? 'الميزات والوظائف الإضافية المطلوبة:' : 'Required Features & Integrations:'}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentRule.features.map((feat) => {
                        const isChecked = selectedFeatures.includes(feat.id);
                        const featFormatted = formatPriceWithCurrency(feat.price, currency, lang);

                        return (
                          <div
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`p-3.5 rounded-xl border text-start cursor-pointer transition-all flex items-start gap-3 ${
                              isChecked
                                ? 'bg-[#19160E] border-[#C9A227] text-white'
                                : 'bg-[#0A0A0A] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                              isChecked ? 'bg-[#C9A227] border-[#C9A227] text-black' : 'bg-neutral-900 border-neutral-700'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <div className="flex-1">
                              <span className="text-xs font-bold block mb-0.5 leading-snug">
                                {lang === 'ar' ? feat.nameAr : feat.nameEn}
                              </span>
                              {effectiveMode !== 'quotation' && feat.price > 0 && (
                                <span className="text-[11px] font-mono font-bold text-[#E5C158]">
                                  +{featFormatted.fullLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Additional Services (Rush delivery, maintenance, etc.) */}
                {currentRule.additionalServices && currentRule.additionalServices.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-200 mb-3">
                      {lang === 'ar' ? 'خيارات وسرعة التنفيذ:' : 'Delivery & Support Options:'}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentRule.additionalServices.map((addon) => {
                        const isChecked = selectedAdditional.includes(addon.id);
                        const addonFormatted = formatPriceWithCurrency(addon.price, currency, lang);

                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAdditional(addon.id)}
                            className={`p-3.5 rounded-xl border text-start cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isChecked
                                ? 'bg-[#19160E] border-[#C9A227] text-white'
                                : 'bg-[#0A0A0A] border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                isChecked ? 'bg-[#C9A227] border-[#C9A227] text-black' : 'bg-neutral-900 border-neutral-700'
                              }`}>
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-semibold">
                                {lang === 'ar' ? addon.nameAr : addon.nameEn}
                              </span>
                            </div>

                            {effectiveMode !== 'quotation' && addon.price > 0 && (
                              <span className="text-xs font-mono font-bold text-[#E5C158] shrink-0">
                                +{addonFormatted.fullLabel}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1 Action Button */}
                <div className="flex items-center justify-end pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all cursor-pointer active:scale-95"
                  >
                    <span>
                      {effectiveMode === 'quotation' || requestModeChoice === 'quotation'
                        ? (lang === 'ar' ? 'متابعة تفاصيل العرض المخصص' : 'Continue to Custom Quote')
                        : (lang === 'ar' ? 'متابعة تفاصيل التقدير' : 'Continue to Breakdown')}
                    </span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================= STEP 2: REVIEW BREAKDOWN OR QUOTATION DETAILS ================= */}
        {step === 2 && currentRule && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left/Main Column: Mode specific content */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* MODE A: AUTOMATIC ESTIMATED PRICING BREAKDOWN */}
                {effectiveMode !== 'quotation' && requestModeChoice !== 'quotation' ? (
                  <div className="rounded-3xl bg-[#121212] border border-[#C9A227]/40 p-6 sm:p-8 shadow-xl space-y-6">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] font-bold mb-1">
                          <Calculator className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'النمط أ: تقدير التكلفة الفوري الديناميكي' : 'Mode A: Automatic Dynamic Estimate'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white font-serif">
                          {lang === 'ar' ? 'تفاصيل الحساب والتكلفة التقديرية' : 'Estimated Cost Breakdown'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A180E] border border-[#C9A227]/30 text-xs text-[#E5C158] font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{lang === 'ar' ? 'حساب فوري مباشر' : 'Live Calculation'}</span>
                      </div>
                    </div>

                    {/* Breakdown items */}
                    {breakdown ? (
                      <div className="space-y-3.5 text-xs">
                        {/* Base price */}
                        <div className="flex justify-between items-center py-2 border-b border-neutral-800/80">
                          <span className="text-neutral-300">
                            {lang === 'ar' ? 'السعر الأساسي للخدمة:' : 'Base Service Rate:'}
                          </span>
                          <span className="font-mono tabular-nums font-bold text-white text-sm">
                            {breakdown.basePrice.toLocaleString()} {breakdown.currency}
                          </span>
                        </div>

                        {/* Extra units */}
                        {breakdown.extraUnitsCount && breakdown.extraUnitsCount > 0 ? (
                          <div className="flex justify-between items-center py-2 border-b border-neutral-800/80">
                            <span className="text-neutral-300">
                              {lang === 'ar' 
                                ? `تكلفة ${breakdown.extraUnitsCount} ${currentRule.unitLabelAr || 'وحدات'} إضافية:` 
                                : `${breakdown.extraUnitsCount} Additional Units Cost:`}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-white text-sm">
                              +{breakdown.unitsCost.toLocaleString()} {breakdown.currency}
                            </span>
                          </div>
                        ) : null}

                        {/* Features */}
                        {breakdown.featuresCost > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-neutral-800/80">
                            <span className="text-neutral-300">
                              {lang === 'ar' ? `الميزات البرمجية والتكاملية (${selectedFeatures.length}):` : `Selected Features (${selectedFeatures.length}):`}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-white text-sm">
                              +{breakdown.featuresCost.toLocaleString()} {breakdown.currency}
                            </span>
                          </div>
                        )}

                        {/* Additional */}
                        {breakdown.additionalCost > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-neutral-800/80">
                            <span className="text-neutral-300">
                              {lang === 'ar' ? `خدمات وسرعة التنفيذ (${selectedAdditional.length}):` : `Delivery Options (${selectedAdditional.length}):`}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-white text-sm">
                              +{breakdown.additionalCost.toLocaleString()} {breakdown.currency}
                            </span>
                          </div>
                        )}

                        {/* Complexity adjustment */}
                        {breakdown.complexityMultiplier > 1.0 && (
                          <div className="flex justify-between items-center py-2 border-b border-neutral-800/80 text-amber-300">
                            <span>
                              {lang === 'ar' ? `معامل تعقيد المشروع (${breakdown.complexityMultiplier}x):` : `Complexity Multiplier (${breakdown.complexityMultiplier}x):`}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-sm">
                              {(breakdown.subtotalAfterComplexity - breakdown.subtotalBeforeComplexity).toLocaleString()} {breakdown.currency}
                            </span>
                          </div>
                        )}

                        {/* Discount */}
                        {breakdown.discountAmount > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-neutral-800/80 text-emerald-400 font-semibold">
                            <span>
                              {lang === 'ar' ? `خصم الحزمة الترويجية (${breakdown.discountPercentage}%):` : `Promotional Discount (${breakdown.discountPercentage}%):`}
                            </span>
                            <span className="font-mono tabular-nums font-bold text-sm">
                              -{breakdown.discountAmount.toLocaleString()} {breakdown.currency}
                            </span>
                          </div>
                        )}

                        {/* Final Estimated Total */}
                        <div className="flex justify-between items-baseline pt-4 border-t-2 border-[#C9A227]/40">
                          <div>
                            <span className="text-base font-bold text-white block">
                              {lang === 'ar' ? 'التكلفة الإجمالية التقديرية:' : 'Total Estimated Cost:'}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {lang === 'ar' ? 'بالعملة المختارة:' : 'Selected currency:'} {currencyMeta.nameAr}
                            </span>
                          </div>

                          <div className="text-end">
                            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] font-mono tabular-nums">
                              {breakdown.estimatedTotal.toLocaleString()}
                            </span>
                            <span className="text-xs text-neutral-300 ms-1.5 font-bold">
                              {breakdown.currency}
                            </span>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                        {lang === 'ar' ? 'جاري حساب التكلفة...' : 'Calculating estimate...'}
                      </div>
                    )}

                    {/* Official disclaimer */}
                    <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-amber-500/20 text-xs text-neutral-300 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-[#E5C158] block mb-0.5">
                          {lang === 'ar' ? 'تنبيه تقديري مهم:' : 'Important Estimate Disclaimer:'}
                        </span>
                        <span>
                          {lang === 'ar' 
                            ? 'هذا الرقم تقديري محسوب لمساعدتك في التخطيط الأولي للميزانية، ولا يعتبر عرض سعر نهائي أو عقداً ملزماً حتى يتم استلام متطلباتك واعتمادها.'
                            : 'This figure is a preliminary estimate to assist with your planning. It is not a binding quotation until all final scope details are reviewed.'}
                        </span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* MODE B: CUSTOM QUOTATION REQUEST DETAILS */
                  <div className="rounded-3xl bg-[#121212] border border-amber-500/40 p-6 sm:p-8 shadow-xl space-y-6">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'النمط ب: دراسة متطلبات وعرض سعر مخصص' : 'Mode B: Custom Quotation Required'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white font-serif">
                          {lang === 'ar' ? 'يتطلب هذا المشروع تقييماً وتخصيصاً لعرض السعر' : 'This Project Requires a Custom Tailored Quote'}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {lang === 'ar'
                        ? 'نظراً للطبيعة المتقدمة والمتخصصة لهذا المشروع، فإننا لا نعرض أسعاراً تقريبية عشوائية. يرجى تزويدنا بتفاصيل متطلباتك وسنقوم بإعداد عرض سعر رسمي محكم خلال 24 ساعة.'
                        : 'Due to the custom architectural nature of this service, we do not present arbitrary fabricated prices. Please provide your exact scope and we will deliver a tailored quote within 24 hours.'}
                    </p>

                    {/* Quotation inputs: Budget range & Preferred deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          {lang === 'ar' ? 'الميزانية التقريبية المقترحة (اختياري):' : 'Proposed Budget Range (Optional):'}
                        </label>
                        <input
                          type="text"
                          value={budgetRange}
                          onChange={(e) => setBudgetRange(e.target.value)}
                          placeholder={lang === 'ar' ? 'مثال: 5,000 - 8,000 ج.م أو 500$...' : 'e.g., $1,000 - $1,500'}
                          className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          {lang === 'ar' ? 'الموعد النهائي المرغوب للإطلاق / التسليم:' : 'Preferred Target Deadline:'}
                        </label>
                        <input
                          type="text"
                          value={preferredDeadline}
                          onChange={(e) => setPreferredDeadline(e.target.value)}
                          placeholder={lang === 'ar' ? 'مثال: خلال أسبوعين، نهاية الشهر الحالي...' : 'e.g., Within 2 weeks'}
                          className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Special requirements textarea */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-2">
                        {lang === 'ar' ? 'شرح متطلبات وتفاصيل مشروعك:' : 'Detailed Project Requirements:'}
                      </label>
                      <textarea
                        rows={3}
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder={lang === 'ar' ? 'اكتب بالتفصيل ما ترغب في تنفيذه، الأنظمة المراد ربطها، أمثلة أو مواقع مرجعية تعجبك...' : 'Describe what you need built, integrations, reference sites...'}
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Optional file / attachment reference */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-2">
                        {lang === 'ar' ? 'رابط ملفات أو مستندات المشروع (Google Drive / Figma):' : 'Project Files or Drive / Figma Reference URL:'}
                      </label>
                      <input
                        type="url"
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        placeholder="https://drive.google.com/... أو https://figma.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                      />
                    </div>

                  </div>
                )}

                {/* Navigation Buttons for Step 2 */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-neutral-300 text-xs font-bold border border-neutral-800 transition-all cursor-pointer"
                  >
                    <BackArrowIcon className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تعديل الاختيارات' : 'Edit Selections'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all cursor-pointer active:scale-95"
                  >
                    <span>{lang === 'ar' ? 'المتابعة لتسجيل الطلب' : 'Proceed to Submission'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Sidebar: Summary Mini-Card */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] font-serif">
                    {lang === 'ar' ? 'ملخص إعدادات الخدمة' : 'Configuration Summary'}
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">{lang === 'ar' ? 'الخدمة:' : 'Service:'}</span>
                      <span className="font-bold text-white text-end max-w-[180px] truncate">
                        {lang === 'ar' ? currentRule.nameAr : currentRule.nameEn}
                      </span>
                    </div>

                    {currentRule.hasUnits && (
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-500">{lang === 'ar' ? 'الكمية:' : 'Units:'}</span>
                        <span className="font-mono text-white">
                          {unitsCount} {lang === 'ar' ? currentRule.unitLabelAr : currentRule.unitLabelEn}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">{lang === 'ar' ? 'التعقيد:' : 'Complexity:'}</span>
                      <span className="font-medium text-[#E5C158]">
                        {(currentRule.complexityOptions || []).find((c) => c.id === complexityId)?.nameAr.split('—')[0] || 'قياسي'}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">{lang === 'ar' ? 'الميزات:' : 'Features:'}</span>
                      <span className="text-white">
                        {selectedFeatures.length} {lang === 'ar' ? 'مختارة' : 'selected'}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-300">
                      <span className="text-neutral-500">{lang === 'ar' ? 'إضافات:' : 'Add-ons:'}</span>
                      <span className="text-white">
                        {selectedAdditional.length} {lang === 'ar' ? 'مختارة' : 'selected'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>
                      {lang === 'ar' ? 'بدون أي دفع مسبق في الموقع' : 'Zero on-site checkout required'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= STEP 3: CONTACT INFORMATION & SUBMIT ================= */}
        {step === 3 && currentRule && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-[#121212] border border-[#C9A227]/40 p-6 sm:p-10 shadow-2xl relative animate-in fade-in duration-200">
            
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227] block mb-2 font-mono">
                {effectiveMode === 'quotation' || requestModeChoice === 'quotation'
                  ? (lang === 'ar' ? 'إرسال طلب عرض سعر مخصص' : 'SUBMIT CUSTOM QUOTATION REQUEST')
                  : (lang === 'ar' ? 'تسجيل طلب التقدير الفوري' : 'SUBMIT ESTIMATE REQUEST')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-2">
                {lang === 'ar' ? 'أدخل بيانات التواصل لتأكيد ومتابعة الطلب' : 'Enter Your Contact Details'}
              </h3>
              <p className="text-xs text-neutral-400">
                {lang === 'ar'
                  ? 'سيتم تسجيل طلبك فوراً برقم تتبع رسمي، وتجهيز محادثة واتساب للتنسيق المباشر.'
                  : 'Your request will be recorded with an official tracking code and prepared for direct WhatsApp chat.'}
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              
              {/* Anti-spam Honeypot field */}
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

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: محمد عبد العزيز' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* Phone & Country Code */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  {lang === 'ar' ? 'رقم الهاتف / واتساب للتواصل *' : 'Phone / WhatsApp Number *'}
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2.5 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs font-mono focus:border-[#C9A227] focus:outline-none cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === 'ar' ? '01012345678 أو 0501234567' : '1234567890'}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-600 text-sm font-mono focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  {lang === 'ar' ? 'البريد الإلكتروني (اختياري لاستلام العرض الرسمي):' : 'Email Address (Optional):'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* Navigation and Submit Button */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-neutral-300 text-xs font-bold border border-neutral-800 transition-all cursor-pointer"
                >
                  <BackArrowIcon className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-xs sm:text-base shadow-[0_0_25px_rgba(201,162,39,0.35)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === 'ar' ? 'جاري تسجيل الطلب...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {effectiveMode === 'quotation' || requestModeChoice === 'quotation'
                          ? (lang === 'ar' ? 'إرسال طلب عرض السعر ومتابعة واتساب' : 'Submit Quotation & Open WhatsApp')
                          : (lang === 'ar' ? 'تأكيد الطلب التقديري ومتابعة واتساب' : 'Confirm Estimate & Open WhatsApp')}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

        {/* Confirmation Modal */}
        {submissionSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg rounded-3xl bg-[#141414] border-2 border-[#C9A227] p-6 sm:p-8 shadow-2xl relative text-center">
              
              <div className="w-16 h-16 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227] mx-auto flex items-center justify-center text-[#C9A227] mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white font-serif mb-2">
                {submissionSuccess.isQuotation
                  ? (lang === 'ar' ? 'تم استلام طلب عرض السعر بنجاح!' : 'Quotation Request Received Successfully!')
                  : (lang === 'ar' ? 'تم استلام وتأكيد طلب التقدير بنجاح!' : 'Estimate Request Received Successfully!')}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
                {submissionSuccess.isQuotation
                  ? (lang === 'ar' 
                      ? 'تم تسجيل طلبك وسيقوم مبارك كبيدة بمراجعة تفاصيل المشروع وإعداد عرض سعر مخصص خلال 24 ساعة.' 
                      : 'Your quotation request is recorded. Mobarak Kibaida will review your scope and provide a custom quote within 24 hours.')
                  : (lang === 'ar'
                      ? 'تم حفظ تفاصيل تقدير التكلفة بنجاح، ويمكنك فتح محادثة واتساب الآن للبدء المباشر.'
                      : 'Your estimate has been safely recorded. You can now chat directly on WhatsApp to get started.')}
              </p>

              {/* Order / Quotation Code Badge */}
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#C9A227]/40 mb-6 flex items-center justify-between">
                <div className="text-start">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    {lang === 'ar' ? 'رقم الطلب الرسمي:' : 'Official Request Code:'}
                  </span>
                  <span className="text-xl font-black font-mono text-[#E5C158]">
                    #{submissionSuccess.orderCode}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30 font-bold">
                  {lang === 'ar' ? 'مسجل في النظام ✓' : 'Saved in DB ✓'}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a
                  href={submissionSuccess.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>{lang === 'ar' ? 'المتابعة في واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setStep(1);
                  }}
                  className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق والعودة للحاسبة' : 'Close and Return'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
