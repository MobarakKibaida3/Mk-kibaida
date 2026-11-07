'use client';

import React from 'react';
import { Language, CurrencyCode } from '@/lib/types';
import { 
  Palette, 
  Globe, 
  ShoppingBag, 
  Cpu, 
  TrendingUp, 
  Workflow, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  MessageCircle,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface ServicesSixGridProps {
  lang: Language;
  onSelectServiceForCalculator?: (serviceKey: string) => void;
  currency?: CurrencyCode;
}

export interface ServiceOverviewItem {
  id: string;
  calculatorKey: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descAr: string;
  descEn: string;
  icon: React.ReactNode;
  badgeAr: string;
  badgeEn: string;
  benefitsAr: string[];
  benefitsEn: string[];
  pricingHintAr: string;
  pricingHintEn: string;
  startingPriceEstimate?: string;
}

export default function ServicesSixGrid({ lang, onSelectServiceForCalculator }: ServicesSixGridProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const servicesData: ServiceOverviewItem[] = [
    {
      id: 'graphic-design-branding',
      calculatorKey: 'graphic-design-branding',
      titleAr: 'الهوية البصرية وتصميم الجرافيك',
      titleEn: 'Graphic Design and Branding',
      taglineAr: 'تصاميم ملكية ترسخ في الذاكرة',
      taglineEn: 'Royal Monograms & Distinctive Brand Collateral',
      descAr: 'نبتكر هويات بصرية متكاملة وشعارات فريدة تعكس هيبة علامتك التجارية، بدءاً من دراسة الألوان والخطوط وحتى تسليم كتيب الهوية الكامل ومطبوعات الأعمال الفاخرة.',
      descEn: 'We craft comprehensive visual brand identities and distinctive logos embodying your brand prestige, from typographic research to complete brand guidelines and print collateral.',
      icon: <Palette className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'الأكثر طلباً للشركات',
      badgeEn: 'Top Choice for Brands',
      benefitsAr: [
        'تصميم لوجو ملكي فريد بجميع صيغ Vector المفتوحة',
        'كتيب إرشادات الهوية البصرية (Brand Guidelines PDF)',
        'قوالب سوشيال ميديا موحدة وبطاقات أعمال فاخرة',
        'موك أب ثلاثي الأبعاد واقعي للعرض التسويقي',
      ],
      benefitsEn: [
        'Bespoke royal logo with full open vector formats',
        'Comprehensive brand guidelines manual (PDF)',
        'Consistent social media kit and luxury stationery',
        'Photorealistic 3D presentation mockups',
      ],
      pricingHintAr: 'تسعير تقديري فوري أو عرض مخصص',
      pricingHintEn: 'Instant estimate or custom quote',
    },
    {
      id: 'website-design-development',
      calculatorKey: 'website-design-development',
      titleAr: 'تصميم وتطوير مواقع الويب',
      titleEn: 'Website Design and Development',
      taglineAr: 'منصات سريعة ومصممة خصيصاً للتحويل',
      taglineEn: 'Custom, High-Performance Web Architecture',
      descAr: 'نبني مواقع ويب تفاعلية حديثة فائقة السرعة، متوافقة تماماً مع جميع الشاشات والأجهزة، ومجهزة بأحدث معايير تجربة المستخدم وتهيئة محركات البحث (SEO).',
      descEn: 'We architect modern, ultra-responsive web applications engineered for speed, search engine optimization (SEO), and conversion-driven user experiences.',
      icon: <Globe className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'أداء برمجي فائق',
      badgeEn: 'Ultra-Fast Performance',
      benefitsAr: [
        'تصميم واجهات UI/UX حصرية متوافقة مع كل الشاشات',
        'أكواد نظيفة فائقة السرعة مع تهيئة محركات البحث SEO',
        'لوحة إدارة محتوى مرنة وسهلة الاستخدام',
        'تأمين كامل وتشفير SSL وحماية ضد الاختراقات',
      ],
      benefitsEn: [
        'Exclusive UI/UX tailored for desktop & mobile devices',
        'Clean high-speed code with advanced SEO optimization',
        'Intuitive content management dashboard',
        'Enterprise security, SSL encryption, and hardening',
      ],
      pricingHintAr: 'تسعير مرن بحسب عدد الصفحات والخصائص',
      pricingHintEn: 'Calculated by page count and features',
    },
    {
      id: 'shopify-store-development',
      calculatorKey: 'shopify-store-development',
      titleAr: 'تطوير وبناء متاجر شوبيفاي',
      titleEn: 'Shopify Store Development',
      taglineAr: 'متاجر إلكترونية متكاملة جاهزة للبيع الفوري',
      taglineEn: 'Turnkey E-Commerce Engines Ready to Scale',
      descAr: 'برمجة وضبط متاجر شوبيفاي احترافية متكاملة، تشمل ثيمات مخصصة سريعة جداً، وتجهيز صفحات المنتجات للتحويل العالي، مع ربط بوابات الدفع الإلكتروني والشحن.',
      descEn: 'Full-cycle Shopify engineering: fast bespoke themes, frictionless checkout flows, local and international payment gateways, and automated courier integrations.',
      icon: <ShoppingBag className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'باقات متجر كاملة متاحة',
      badgeEn: 'Turnkey Bundles Available',
      benefitsAr: [
        'ثيم شوبيفاي فائق السرعة يدعم العربية والإنجليزية',
        'ربط بوابات الدفع (فيزا، مدى، أبل باي، تابي، تمارا)',
        'إعداد خيارات الشحن وتتبع الطلبات التلقائي',
        'تصميم صفحات هبوط تسويقية تضاعف نسبة المبيعات',
      ],
      benefitsEn: [
        'Bespoke ultra-fast theme with full Arabic/English support',
        'Payment gateways (Visa, Mada, Apple Pay, Tabby, Tamara)',
        'Automated shipping calculation and live tracking',
        'Conversion-optimized landing pages that boost AOV',
      ],
      pricingHintAr: 'يشمل باقات سريعة وحاسبة متقدمة',
      pricingHintEn: 'Includes fast bundles and smart calculator',
    },
    {
      id: 'ai-solutions',
      calculatorKey: 'ai-solutions',
      titleAr: 'حلول وتطبيقات الذكاء الاصطناعي',
      titleEn: 'AI Solutions',
      taglineAr: 'تقنيات سينمائية وأتمتة تفاعلية متقدمة',
      taglineEn: 'Cinematic AI Visuals & Smart Agents',
      descAr: 'نوظف أحدث نماذج الذكاء الاصطناعي لتوليد صور منتجات واقعية بدقة 8K دون تكاليف تصوير استوديو، بالإضافة لبناء شات بوت ذكي لخدمة العملاء وأتمتة المهام.',
      descEn: 'We harness modern AI architectures to produce 8K photorealistic product studio renders, smart customer support chatbots, and automated content generation workflows.',
      icon: <Cpu className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'تكنولوجيا متطورة',
      badgeEn: 'Next-Gen AI Tech',
      benefitsAr: [
        'توليد صور منتجات سينمائية 8K تضاهي جلسات التصوير الباهظة',
        'روبوتات دردشة ذكية للرد على استفسارات العملاء على مدار الساعة',
        'أتمتة كتابة الوصف التسويقي وصناعة المحتوى الترويجي',
        'توفير حتى 70% من ميزانية الإنتاج والتصوير التجاري',
      ],
      benefitsEn: [
        '8K photorealistic product shoots without expensive sets',
        '24/7 intelligent customer care assistants & chatbots',
        'Automated persuasive copy and marketing generation',
        'Up to 70% cost savings on commercial photography',
      ],
      pricingHintAr: 'حساب تقديري أو كوتيشن للمشاريع الكبيرة',
      pricingHintEn: 'Dynamic estimate or enterprise quote',
    },
    {
      id: 'digital-marketing',
      calculatorKey: 'digital-marketing',
      titleAr: 'التسويق الرقمي وإدارة الحملات',
      titleEn: 'Digital Marketing',
      taglineAr: 'استراتيجيات نمو ممولة وتحقيق أعلى عائد ROAS',
      taglineEn: 'Data-Backed Media Buying & High ROAS Campaigns',
      descAr: 'إدارة وتوجيه الحملات الإعلانية الممولة باحترافية على منصات ميتا (فيسبوك وإنستغرام)، تيك توك، وسناب شات، مع اختبارات A/B مستمرة لتعظيم مبيعاتك.',
      descEn: 'Strategic paid media acquisition across Meta, TikTok, and Snapchat, with relentless A/B testing and creative optimization to maximize your return on ad spend (ROAS).',
      icon: <TrendingUp className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'نتائج قابلة للقياس',
      badgeEn: 'Measurable ROI',
      benefitsAr: [
        'هندسة واستهداف دقيق للجمهور المهتم بالشراء الفعلي',
        'صناعة تصاميم إعلانية وسكريبتات ريلز تسويقية جذابة',
        'إعداد بيكسل التتبع وAPI التحويلات بدقة 100%',
        'تقارير أسبوعية تفصيلية بالنتائج ونسبة العائد على الإنفاق',
      ],
      benefitsEn: [
        'Precision audience targeting and high-intent segments',
        'Scroll-stopping visual ad creatives and Reels hooks',
        '100% accurate Pixel and Conversions API setup',
        'Detailed performance analytics and transparent reporting',
      ],
      pricingHintAr: 'باقات إدارة شهرية أو إطلاق حملات',
      pricingHintEn: 'Monthly management or launch campaigns',
    },
    {
      id: 'automation-system-integrations',
      calculatorKey: 'automation-system-integrations',
      titleAr: 'أتمتة العمليات والربط التقني',
      titleEn: 'Business Process Automation and Integrations',
      taglineAr: 'ربط سلس بين الأنظمة وتوفير مئات ساعات العمل',
      taglineEn: 'Frictionless API Integrations & Automated Workflows',
      descAr: 'نربط متجرك وموقعك مع أنظمة المحاسبة، برامج إدارة المخزون، وشركات الشحن، مع أتمتة إرسال رسائل الواتساب والفواتير تلقائياً دون أي تدخل بشري.',
      descEn: 'Connect your storefront with ERPs, CRMs, inventory managers, and courier APIs. Automate customer WhatsApp order notifications and invoicing effortlessly.',
      icon: <Workflow className="w-7 h-7 text-[#C9A227]" />,
      badgeAr: 'توفير التكاليف والأخطاء',
      badgeEn: 'Zero Human Error',
      benefitsAr: [
        'إرسال إشعارات وتأكيدات الطلب عبر واتساب تلقائياً',
        'مزامنة المخزون والطلبات فورياً بين منصات البيع المتعددة',
        'ربط بوابات الدفع مع برامج الفوترة والمحاسبة السحابية',
        'تقليل الأخطاء البشرية وتوفير أكثر من 30 ساعة عمل أسبوعياً',
      ],
      benefitsEn: [
        'Instant automated WhatsApp order and dispatch updates',
        'Real-time multi-channel inventory synchronization',
        'Seamless payment gateway and accounting integrations',
        'Save 30+ staff hours weekly by automating routines',
      ],
      pricingHintAr: 'عروض أسعار مخصصة بحسب الأنظمة المطلوبة',
      pricingHintEn: 'Custom quotes based on system architecture',
    },
  ];

  const handleAction = (service: ServiceOverviewItem) => {
    if (onSelectServiceForCalculator) {
      onSelectServiceForCalculator(service.calculatorKey);
    }
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 sm:py-24 bg-[#0A0A0A] relative border-t border-neutral-900 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-[#E5C158]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/30 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">
              {lang === 'ar' ? 'الخدمات الرقمية المتخصصة' : 'SPECIALIZED DIGITAL DISCIPLINES'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif mb-4">
            {lang === 'ar' ? 'خدمات احترافية مصممة لنمو مشروعك' : 'Professional Services Built for Scalable Growth'}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'اختر مجالك المطلوب لتصفح المزايا وحساب التكلفة التقديرية بدقة أو طلب عرض سعر مفصل لمشروعك.'
              : 'Explore each discipline below to view key benefits, calculate instant estimated costs, or request a bespoke quotation.'}
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const waQuery = encodeURIComponent(
              lang === 'ar'
                ? `مرحباً مبارك! أرغب في الاستفسار وطلب عرض سعر لخدمة: ${service.titleAr}`
                : `Hello Mobarak! I would like to inquire and request a quotation for: ${service.titleEn}`
            );

            return (
              <div
                key={service.id}
                className="rounded-2xl bg-[#121212] border border-neutral-800/80 hover:border-[#C9A227]/60 p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_35px_rgba(201,162,39,0.12)] hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Subtle Top Gold Highlight Bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent group-hover:via-[#C9A227] transition-all" />

                <div>
                  {/* Top Badge and Icon Header */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#C9A227]/30 flex items-center justify-center group-hover:border-[#C9A227] group-hover:scale-105 transition-all shadow-inner">
                      {service.icon}
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#1A1A1A] text-[#E5C158] border border-[#C9A227]/20 whitespace-nowrap">
                      {lang === 'ar' ? service.badgeAr : service.badgeEn}
                    </span>
                  </div>

                  {/* Service Number & Titles */}
                  <div className="mb-4">
                    <span className="text-xs font-mono text-neutral-400 font-bold block mb-1">
                      0{index + 1}.
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif group-hover:text-[#E5C158] transition-colors mb-1.5">
                      {lang === 'ar' ? service.titleAr : service.titleEn}
                    </h3>
                    <p className="text-xs text-[#C9A227] font-medium">
                      {lang === 'ar' ? service.taglineAr : service.taglineEn}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {lang === 'ar' ? service.descAr : service.descEn}
                  </p>

                  {/* Deliverables & Benefits Highlights */}
                  <div className="mb-6 space-y-2.5 pt-4 border-t border-neutral-800/80">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block">
                      {lang === 'ar' ? 'أبرز المزايا والمخرجات:' : 'Key Deliverables & Benefits:'}
                    </span>
                    {(lang === 'ar' ? service.benefitsAr : service.benefitsEn).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 border-t border-neutral-800/80 mt-2 space-y-3">
                  
                  {/* Primary Action: Go to Calculator */}
                  <button
                    type="button"
                    onClick={() => handleAction(service)}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] flex items-center justify-center gap-2 group/btn transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-black" />
                    <span>{lang === 'ar' ? 'احسب التكلفة أو اطلب عرض سعر' : 'Calculate Cost or Request Quote'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {/* Secondary Action: Direct WhatsApp Quote */}
                  <a
                    href={`https://wa.me/201033615727?text=${waQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-[#161616] hover:bg-[#1E1E1E] border border-neutral-800 hover:border-[#25D366]/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>{lang === 'ar' ? 'استفسار سريع عبر واتساب' : 'Quick Inquiry on WhatsApp'}</span>
                  </a>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Callout: Linking to Turnkey Bundles on /home */}
        <div className="mt-14 sm:mt-16 p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141414] via-[#1A1812] to-[#141414] border border-[#C9A227]/40 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-[0_0_30px_rgba(201,162,39,0.08)] max-w-full">
          <div className="space-y-1 text-center sm:text-start max-w-full">
            <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider block">
              {lang === 'ar' ? 'عروض الباقات الجاهزة والمجمعة' : 'TURNKEY PACKAGES & FAST OFFERS'}
            </span>
            <h4 className="text-base sm:text-xl font-bold text-white font-serif">
              {lang === 'ar' 
                ? 'هل تريد حلاً متكاملاً لإطلاق متجر شوبيفاي مع ثيم مخصص وملف التصدير؟'
                : 'Need an all-in-one launchpad with custom theme and ready-to-run export?'}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {lang === 'ar'
                ? 'تصفح صفحة الباقات الخاصة التي تشمل باقة المتجر الكامل بسعر 6,000 ج.م بدلاً من 8,500 ج.م مع تتبع الطلبات المباشر.'
                : 'Visit our Turnkey Store page featuring the full store bundle at 6,000 EGP with live order tracking.'}
            </p>
          </div>

          <a
            href="/home#featured-offer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-[#FFECA8] to-[#E5C158] hover:from-white hover:to-[#E5C158] whitespace-nowrap shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <span>{lang === 'ar' ? 'استكشف باقة المتجر الكامل' : 'Explore Turnkey Bundle'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
