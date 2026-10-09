'use client';

import React from 'react';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { Send, MessageCircle, Palette, Award } from 'lucide-react';

interface ProcessSectionProps {
  lang: Language;
}

export default function ProcessSection({ lang }: ProcessSectionProps) {
  const t = translations[lang].process;

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: <Send className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: <MessageCircle className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: <Palette className="w-5 h-5 text-[#C9A227]" />,
    },
    {
      num: '04',
      title: t.step4Title,
      desc: t.step4Desc,
      icon: <Award className="w-5 h-5 text-[#C9A227]" />,
    },
  ];

  return (
    <section id="process" className="py-20 bg-[#0E0E0E] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] mb-2 block">
            {lang === 'ar' ? 'سلاسة وسرعة الإنجاز' : 'SEAMLESS EXECUTION'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-3">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-[#141414] border border-neutral-800 p-6 flex flex-col justify-between hover:border-[#C9A227]/40 transition-all hover:bg-[#181818] group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#C9A227]/30 flex items-center justify-center group-hover:border-[#C9A227] transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black font-mono tabular-nums text-neutral-400 group-hover:text-[#C9A227] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-serif mb-2.5">
                  {step.title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-[#C9A227]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span>{lang === 'ar' ? 'متابعة مباشرة ومستمرة' : 'Direct continuous follow-up'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
