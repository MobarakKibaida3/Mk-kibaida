'use client';

import React, { useState } from 'react';
import { translations } from '@/lib/translations';
import { Language } from '@/lib/types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  lang: Language;
}

export default function FAQSection({ lang }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[lang].faq;

  const faqs = [
    {
      qAr: 'كيف يتم تسليم ومتابعة طلبي بعد إرسال النموذج؟',
      qEn: 'How is my project fulfilled and coordinated after submitting the form?',
      aAr: 'بمجرد ضغط زر الإرسال، يُفتح لك رابط محادثة واتساب مباشر مع مبارك يحتوي على رقم طلبك وتفاصيله. نتفق في المحادثة على كافة الجزئيات، ونحدد موعد التسليم بدقة، وترسل أي ملفات مرجعية لديك مباشرة.',
      aEn: 'Once submitted, a pre-formatted WhatsApp chat opens with Mobarak including your order reference. We confirm exact specifications, timelines, and you can drop any reference assets directly in chat.',
    },
    {
      qAr: 'هل أحتاج لدفع أي مبالغ داخل هذا الموقع؟',
      qEn: 'Do I need to pay or enter card details on this website?',
      aAr: 'لا على الإطلاق! الموقع مخصص لعرض الخدمات والأسعار وتسهيل الطلب. لا يوجد أي دفع إلكتروني أو بطاقات ائتمان داخل الموقع، ويتم الاتفاق على طرق الدفع المناسبة لك (فودافون كاش، إنستاباي، تحويل بنكي في السعودية أو مصر) عبر واتساب مباشرة.',
      aEn: 'Not at all! There is zero online billing or card processing on-site. Payment arrangements (InstaPay, Vodafone Cash, local bank transfer in KSA/Egypt) are coordinated directly via WhatsApp.',
    },
    {
      qAr: 'ما هي سياسة التعديلات؟ وهل هناك ضمان للرضا؟',
      qEn: 'What is the revision policy and satisfaction guarantee?',
      aAr: 'نقدم تعديلات مجانية على جميع تصاميمنا حتى تكون راضياً تماماً بنسبة 100%. نهتم بأدق التفاصيل لضمان ظهور متجرك أو هويتك بأعلى معايير الإبهار.',
      aEn: 'We provide complimentary revisions on all designs until you are 100% delighted with the final execution. Perfection in detail is our studio standard.',
    },
    {
      qAr: 'ما هي صيغ الملفات التي أستلمها عند اكتمال العمل؟',
      qEn: 'What file formats will I receive upon project completion?',
      aAr: 'تستلم جميع الملفات المصدرية المفتوحة: ملفات اللوجو بصيغ Vector عالية الدقة (AI, SVG, PNG شفاف، PDF)، وثيمات شوبيفاي في ملف مضغوط (Theme Zip) جاهز للرفع، والفيديوهات بدقة 4K فائقة الوضوح.',
      aEn: 'You receive full master source files: vector artwork (AI, SVG, high-res PNG, PDF), turnkey Shopify Theme Zip files, and crystal-clear 4K video exports.',
    },
    {
      qAr: 'كم تستغرق مدة تنفيذ المشاريع عادة؟',
      qEn: 'How long does project delivery typically take?',
      aAr: 'تتراوح المدة حسب نوع الخدمة: الفيديوهات والشورتس خلال 24 - 48 ساعة، تصاميم اللوجو 2 - 3 أيام، وباقة المتجر الكامل وثيم شوبيفاي 4 - 6 أيام عمل مع متابعة مستمرة.',
      aEn: 'Timelines vary by scope: short reels take 24–48 hours, logo designs take 2–3 days, while complete Shopify turnkey stores take 4–6 business days.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#0E0E0E] relative border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191919] border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-3">
            {t.title}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const question = lang === 'ar' ? faq.qAr : faq.qEn;
            const answer = lang === 'ar' ? faq.aAr : faq.aEn;

            return (
              <div
                key={idx}
                className="rounded-xl bg-[#141414] border border-neutral-800 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-start p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#181818] transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white font-serif">
                    {question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#0A0A0A] border border-neutral-700 flex items-center justify-center shrink-0 text-[#C9A227] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#C9A227]/10 border-[#C9A227]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-4 animate-in fade-in duration-200">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
