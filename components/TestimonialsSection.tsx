'use client';

import React from 'react';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { Star, MessageCircle, CheckCircle2, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  lang: Language;
}

export default function TestimonialsSection({ lang }: TestimonialsSectionProps) {
  const t = translations[lang].testimonials;

  const reviews = [
    {
      id: 1,
      nameAr: 'م. فهد السبيعي',
      nameEn: 'Eng. Fahad Al-Subaie',
      roleAr: 'مؤسس متجر عبايات وعطور، الرياض',
      roleEn: 'Founder, Abaya & Perfumes Boutique, Riyadh',
      serviceAr: 'باقة المتجر الكامل + الثيم المخصص',
      serviceEn: 'Full Store Bundle + Custom Theme',
      stars: 5,
      quoteAr: 'مبارك إنسان مبدع ومحترف للغاية. تسلمت المتجر في 5 أيام بالضبط بثيم سريع جداً وتصميم فخم فاق كل توقعاتنا، والمبيعات من أول أسبوع تضاعفت!',
      quoteEn: 'Mobarak delivered an immaculate Shopify storefront in 5 days flat. Blazing speed, pure luxury aesthetic, and our launch week conversions exceeded all targets.',
      verified: true,
      timeAr: 'منذ 3 أسابيع عبر واتساب',
      timeEn: '3 weeks ago via WhatsApp',
    },
    {
      id: 2,
      nameAr: 'أحمد جمال',
      nameEn: 'Ahmed Gamal',
      roleAr: 'صاحب براند أحذية رياضية، القاهرة',
      roleEn: 'Owner, Athletic Streetwear Brand, Cairo',
      serviceAr: 'تصميم منتجات بالذكاء الاصطناعي',
      serviceEn: 'AI Product Design Series',
      stars: 5,
      quoteAr: 'الصور التي صممها بالذكاء الاصطناعي بدت حقيقية 100% وكأننا صورنا في استوديو أوروبي! وفر علينا أكثر من 15 ألف جنيه تكاليف فوتوسيشن.',
      quoteEn: 'The AI product visuals looked 100% photorealistic, as if shot in a top European studio. Saved us huge production fees while increasing ad CTR.',
      verified: true,
      timeAr: 'منذ شهر عبر واتساب',
      timeEn: '1 month ago via WhatsApp',
    },
    {
      id: 3,
      nameAr: 'نورة المنصوري',
      nameEn: 'Noura Al-Mansoori',
      roleAr: 'مديرة تسويق براند مستحضرات تجميل، دبي',
      roleEn: 'Marketing Director, Clean Beauty, Dubai',
      serviceAr: 'تصميم هوية بصرية + فيديوهات شورتس',
      serviceEn: 'Brand Identity + Viral Short Reels',
      stars: 5,
      quoteAr: 'التعامل مع مبارك مريح جداً؛ سريع في الرد، وينفذ أي تعديل نطلبه بصدر رحب وإتقان. الفيديوهات القصيرة التي عملها حققت انتشاراً واسعاً على إنستجرام.',
      quoteEn: 'Seamless collaboration from brief to delivery. Receptive to feedback, highly skilled, and the vertical video reels generated high organic reach.',
      verified: true,
      timeAr: 'منذ أسبوعين عبر واتساب',
      timeEn: '2 weeks ago via WhatsApp',
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] mb-2 block">
            {lang === 'ar' ? 'ثقة ومصداقية حقيقية' : 'PROVEN SATISFACTION'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif mb-4">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl bg-[#141414] border border-neutral-800/90 p-7 flex flex-col justify-between hover:border-[#C9A227]/40 transition-all shadow-md relative group"
            >
              <div>
                {/* Header of review */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-[#C9A227]">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A227]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30">
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp Verified</span>
                  </div>
                </div>

                {/* Service Tag */}
                <p className="text-xs text-[#C9A227] font-semibold mb-3">
                  {lang === 'ar' ? rev.serviceAr : rev.serviceEn}
                </p>

                {/* Quote */}
                <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                  &ldquo;{lang === 'ar' ? rev.quoteAr : rev.quoteEn}&rdquo;
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-serif">
                    {lang === 'ar' ? rev.nameAr : rev.nameEn}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {lang === 'ar' ? rev.roleAr : rev.roleEn}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227]">
                  <Quote className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
