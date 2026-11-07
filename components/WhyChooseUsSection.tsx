'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { 
  Sparkles, 
  Crown, 
  Zap, 
  Code2, 
  Calculator, 
  Headphones, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';

interface WhyChooseUsSectionProps {
  lang: Language;
}

export default function WhyChooseUsSection({ lang }: WhyChooseUsSectionProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const pillars = [
    {
      icon: <Crown className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'طابع بصري ملكي فاخر',
      titleEn: 'Royal Bespoke Aesthetics',
      descAr: 'نصمم هويات استثنائية وثيمات راقية بألوان الأسود والذهبي والأنماط المعاصرة، تجعل علامتك تبدو كبراند عالمي من اللحظة الأولى.',
      descEn: 'Distinctive black-and-gold visual identities and high-end themes that establish immediate prestige and authority.',
    },
    {
      icon: <Zap className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'سرعة قياسية والتزام صارم',
      titleEn: 'Fast Turnaround & Strict Deadlines',
      descAr: 'نبدأ العمل خلال ساعات من تأكيد الطلب، مع فترات تسليم تتراوح بين 24 ساعة للخدمات السريعة و3 إلى 7 أيام للمتاجر المتكاملة.',
      descEn: 'Immediate project kickoff with rapid milestones: from 24-hour collateral to 3-7 day complete turnkey store launches.',
    },
    {
      icon: <Code2 className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'أكواد نظيفة وأداء فائق السرعة',
      titleEn: 'Clean Architecture & Top Speed',
      descAr: 'مواقع ومتاجر خفيفة الوزن، متوافقة 100% مع الهواتف الذكية، وسريعة التحميل لضمان عدم هروب العملاء وتخفيض تكلفة الإعلانات.',
      descEn: 'Zero bloat, high Core Web Vitals, and lightning-fast page loads to keep bounce rates minimal and maximize ad ROAS.',
    },
    {
      icon: <Calculator className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'حاسبة أسعار ذكية وشفافة',
      titleEn: 'Smart Dual-Pricing System',
      descAr: 'احصل على تقدير فوري للتكلفة بحسب خياراتك، أو اطلب عرض سعر مخصص مجاناً دون أي رسوم خفية أو مبالغات تسعيرية.',
      descEn: 'Transparent instant cost estimation plus custom quotation requests backed by admin-controlled transparent pricing rules.',
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'تعديلات مجانية حتى الرضا التام',
      titleEn: 'Free Revisions Until Satisfaction',
      descAr: 'نقدم جولات مراجعة وتعديلات دقيقة حتى تطابق النتيجة النهائية تطلعاتك وتلبي احتياجات نشاطك التجاري بالكامل.',
      descEn: 'Dedicated revision rounds ensuring the delivered assets match your exacting standards and commercial vision.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#C9A227]" />,
      titleAr: 'تواصل مباشر مع مبارك كبيدة',
      titleEn: 'Direct WhatsApp Line with Founder',
      descAr: 'بدون وسطاء أو موظفي دعم آليين؛ تتواصل مباشرة مع المصمم والمطور المسؤول عن مشروعك لحل أي استفسار فوراً.',
      descEn: 'Direct access to Mobarak Kibaida via WhatsApp with no frustrating intermediaries or automated response walls.',
    },
  ];

  return (
    <section id="why-us" className="py-20 sm:py-24 bg-[#0A0A0A] relative border-t border-neutral-900 overflow-hidden">
      
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/2 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-[#C9A227]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">
              {lang === 'ar' ? 'معايير النخبة' : 'WHY CLIENTS TRUST US'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-4">
            {lang === 'ar' ? 'لماذا تختار منصة مبارك كبيدة الرقمية؟' : 'Why Partner With Mobarak Kibaida?'}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'نجمع بين الشغف الفني الراقي والدقة البرمجية العالية لنقدم لك قيمة حقيقية تنعكس على نمو أعمالك ومصداقية علامتك.'
              : 'We combine meticulous artistic sensibility with disciplined engineering to deliver tangible commercial growth.'}
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#121212] border border-neutral-800/80 hover:border-[#C9A227]/50 transition-all hover:bg-[#161616] group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#C9A227]/30 flex items-center justify-center mb-5 group-hover:border-[#C9A227] group-hover:scale-105 transition-all">
                  {pillar.icon}
                </div>

                <h3 className="text-lg font-bold text-white font-serif mb-2.5 group-hover:text-[#E5C158] transition-colors">
                  {lang === 'ar' ? pillar.titleAr : pillar.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {lang === 'ar' ? pillar.descAr : pillar.descEn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] text-[#C9A227] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'معتمد ومضمون 100%' : 'Guaranteed Quality Standard'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
