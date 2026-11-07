'use client';

import React from 'react';
import Image from 'next/image';
import { Language } from '@/lib/types';
import MkLogo from './MkLogo';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Users, 
  Globe2, 
  Clock, 
  HeartHandshake,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface AboutAgencySectionProps {
  lang: Language;
}

export default function AboutAgencySection({ lang }: AboutAgencySectionProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="about" className="py-24 bg-[#070707] relative border-t border-neutral-900 overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Emblem & Brand Card */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-[#C9A227]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative group">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#C9A227]/20 to-[#E5C158]/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <MkLogo size="lg" showSubtitle={true} />
                </div>

                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto" />

                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-bold text-white font-serif">
                    {lang === 'ar' ? 'مبارك كبيدة — Mobarak Kibaida' : 'Mobarak Kibaida'}
                  </h3>
                  <p className="text-xs text-[#E5C158] font-medium tracking-wide">
                    {lang === 'ar' ? 'مؤسس المنصة & مهندس الحلول الرقمية' : 'Founder & Principal Digital Architect'}
                  </p>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'متخصص في بناء الهويات التجارية الفاخرة وتطوير متاجر شوبيفاي والأنظمة الرقمية الذكية للشركات الناشئة والعلامات التجارية الرائدة.'
                    : 'Specialized in royal visual identities, high-conversion Shopify storefronts, and automated AI systems for visionary founders.'}
                </p>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800 text-start">
                  <div className="p-3 rounded-xl bg-[#0F0F0F] border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                      {lang === 'ar' ? 'نطاق الخدمة' : 'Service Reach'}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{lang === 'ar' ? 'مصر، السعودية & دولياً' : 'Egypt, GCC & Global'}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0F0F0F] border border-neutral-800/80">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                      {lang === 'ar' ? 'ضمان العمل' : 'Execution Standard'}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{lang === 'ar' ? 'دقة وتعديل حتى الرضا' : 'Bespoke Quality'}</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#C9A227]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                {lang === 'ar' ? 'عن المنصة ورؤيتنا' : 'ABOUT OUR DIGITAL PRACTICE'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif leading-tight">
              {lang === 'ar' ? (
                <>
                  نبني مشاريع رقمية استثنائية{' '}
                  <span className="text-[#E5C158]">تجمع بين الفخامة والنتائج البيعية</span>
                </>
              ) : (
                <>
                  Crafting Digital Ventures That Marry{' '}
                  <span className="text-[#E5C158]">Bespoke Luxury With Conversion Power</span>
                </>
              )}
            </h2>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
              <p>
                {lang === 'ar'
                  ? 'انطلقت منصة مبارك كبيدة (MobarakKibaida.online) كشريك رقمي متكامل لرواد الأعمال والعلامات التجارية التي لا ترضى بالحلول الجاهزة المكررة. نؤمن بأن الهوية التجارية ليست مجرد ألوان عشوائية، وأن المتجر الإلكتروني ليس مجرد صفحات صامتة، بل هو تجربة متكاملة مصممة لجذب العملاء وبناء الثقة ومضاعفة المبيعات.'
                  : 'MobarakKibaida.online was founded as a dedicated digital partner for founders and forward-thinking enterprises. We believe a visual brand is far more than random graphics, and an online store is much more than static pages: it is an immersive revenue engine built to command respect and drive results.'}
              </p>
              <p className="text-neutral-400 text-sm">
                {lang === 'ar'
                  ? 'من خلال خبرتنا المتراكمة في الهوية البصرية، وتصميم ثيمات شوبيفاي المخصصة، وتطبيقات الذكاء الاصطناعي والأتمتة، نساعد عملاءنا في مصر والمملكة العربية السعودية والإمارات وشتى أنحاء العالم على تحويل أفكارهم إلى مشاريع مربحة وناجحة بأعلى دقة واحترافية.'
                  : 'Drawing on deep expertise in visual identities, custom Shopify architectures, and modern AI/automation pipelines, we empower clients across Egypt, Saudi Arabia, UAE, and internationally to scale profitable, memorable ventures.'}
              </p>
            </div>

            {/* Core Values / Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121212] border border-neutral-800">
                <CheckCircle2 className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                    {lang === 'ar' ? 'حلول مخصصة 100%' : '100% Tailored Solutions'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    {lang === 'ar' ? 'لا نستخدم قوالب مستهلكة؛ كل مشروع يصمم لعلامتك خصيصاً.' : 'Zero copy-paste templates; everything is bespoke to your business.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121212] border border-neutral-800">
                <HeartHandshake className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                    {lang === 'ar' ? 'شفافية تسعير كاملة' : 'Transparent Pricing'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    {lang === 'ar' ? 'حاسبة تكلفة ذكية وعروض أسعار واضحة بدون مصاريف مستترة.' : 'Real-time estimates & custom quotations with zero hidden surprises.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121212] border border-neutral-800">
                <Clock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                    {lang === 'ar' ? 'التزام صارم بالمواعيد' : 'Strict Turnaround Times'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    {lang === 'ar' ? 'نحترم وقتك ونلتزم بجدول زمني دقيق لكل مرحلة من مراحل المشروع.' : 'We honor your schedule with precise milestones and prompt delivery.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#121212] border border-neutral-800">
                <Award className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                    {lang === 'ar' ? 'دعم مستمر بعد الإطلاق' : 'Continuous Post-Launch Support'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    {lang === 'ar' ? 'نبقى بجانبك لضمان التشغيل السلس والإجابة على أي استفسارات.' : 'Ongoing technical guidance to ensure smooth operation post launch.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E5C158] hover:text-white transition-colors"
              >
                <span>{lang === 'ar' ? 'تعرف على خدماتنا وحلولنا بالتفصيل' : 'Explore all specialized disciplines'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
