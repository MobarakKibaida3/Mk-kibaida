'use client';

import React from 'react';
import { Language } from '@/lib/types';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Calculator,
  Send
} from 'lucide-react';

interface ContactWhatsAppSectionProps {
  lang: Language;
}

export default function ContactWhatsAppSection({ lang }: ContactWhatsAppSectionProps) {
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const defaultMsg = encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً أستاذ مبارك! أرغب في مناقشة تفاصيل مشروعي وبدء التنفيذ.'
      : 'Hello Mobarak! I would like to discuss my project requirements and get started.'
  );

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#080808] relative border-t border-neutral-900 overflow-hidden">
      
      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-[#25D366]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#25D366]/30 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider">
              {lang === 'ar' ? 'تواصل فوري ومباشر' : 'INSTANT DIRECT CONTACT'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-4">
            {lang === 'ar' ? 'دعنا نتحدث عن مشروعك القادم' : 'Let’s Bring Your Vision to Life'}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'تواصل مباشرة مع مبارك كبيدة لمناقشة أفكارك، الحصول على استشارة سريعة، أو تأكيد متطلبات مشروعك فوراً.'
              : 'Connect directly with Mobarak Kibaida for an instant consultation, scoping advice, or fast quotation confirmation.'}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* 1. WhatsApp Card (Primary) */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0E0E0E] border border-[#25D366]/40 hover:border-[#25D366] transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(37,211,102,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/10 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#25D366]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-[#25D366]" />
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 inline-block mb-3">
                {lang === 'ar' ? 'الرد الأسرع (أقل من 15 دقيقة)' : 'Fastest Response (< 15 mins)'}
              </span>

              <h3 className="text-xl font-bold text-white font-serif mb-2">
                {lang === 'ar' ? 'محادثة واتساب مباشرة' : 'Direct WhatsApp Chat'}
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {lang === 'ar'
                  ? 'تحدث معي شخصياً لمناقشة تفاصيل الشعار، المتجر، أو استفسار التسعير في أي وقت.'
                  : 'Message directly for rapid project scoping, technical consultations, or quote inquiries.'}
              </p>

              <div className="text-sm font-mono text-[#E5C158] font-bold mb-6" dir="ltr">
                +20 103 361 5727
              </div>
            </div>

            <a
              href={`https://wa.me/201033615727?text=${defaultMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>{lang === 'ar' ? 'افتح محادثة واتساب الآن' : 'Start WhatsApp Chat Now'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 2. Email Inquiry Card */}
          <div className="p-8 rounded-2xl bg-[#121212] border border-neutral-800 hover:border-[#C9A227]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-neutral-700 flex items-center justify-center mb-6 group-hover:border-[#C9A227] transition-colors">
                <Mail className="w-7 h-7 text-[#C9A227]" />
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 inline-block mb-3">
                {lang === 'ar' ? 'مراسلات رسمية وعروض أسعار' : 'Formal Proposals & RFPs'}
              </span>

              <h3 className="text-xl font-bold text-white font-serif mb-2">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Official Email'}
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {lang === 'ar'
                  ? 'أرسل كراسة الشروط أو ملفات المتطلبات للمشاريع الكبيرة والتعاقدات المؤسسية.'
                  : 'Send project briefs, RFP specifications, or enterprise partnership inquiries.'}
              </p>

              <div className="text-xs sm:text-sm font-mono text-neutral-300 mb-6 truncate" dir="ltr">
                mobarakkibaida3@gmail.com
              </div>
            </div>

            <a
              href="mailto:mobarakkibaida3@gmail.com?subject=Project%20Inquiry%20-%20Mobarak%20Kibaida"
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-neutral-200 hover:text-white bg-[#1A1A1A] hover:bg-[#222222] border border-neutral-700 hover:border-[#C9A227] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{lang === 'ar' ? 'إرسال بريد إلكتروني' : 'Send an Email'}</span>
            </a>
          </div>

          {/* 3. Smart Calculator / Quotation Jump */}
          <div className="p-8 rounded-2xl bg-[#121212] border border-neutral-800 hover:border-[#C9A227]/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-neutral-700 flex items-center justify-center mb-6 group-hover:border-[#C9A227] transition-colors">
                <Calculator className="w-7 h-7 text-[#C9A227]" />
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 inline-block mb-3">
                {lang === 'ar' ? 'تسعير ذاتي فوري' : 'Interactive Self-Scoping'}
              </span>

              <h3 className="text-xl font-bold text-white font-serif mb-2">
                {lang === 'ar' ? 'حاسبة التكاليف وعروض الأسعار' : 'Cost Calculator & Quotes'}
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {lang === 'ar'
                  ? 'حدد خدماتك ومواصفات مشروعك لتحصل على تسعير فوري أو ترسل طلب كوتيشن مخصص لإدارتنا.'
                  : 'Configure project specs to view instant estimates or submit a formal quotation request.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>{lang === 'ar' ? 'أسعار واضحة بدون مصاريف خفية' : 'Transparent, verified rates'}</span>
              </div>
            </div>

            <a
              href="#calculator"
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'انتقل إلى حاسبة التكاليف' : 'Go to Calculator'}</span>
            </a>
          </div>

        </div>

        {/* Operating Hours and Geographic Notice */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span>
              {lang === 'ar' 
                ? 'استقبال الطلبات والاستفسارات: متاح 24/7 طوال أيام الأسبوع' 
                : 'Inquiries & Brief Submissions: 24/7 all week'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span>
              {lang === 'ar'
                ? 'المقر الرئيسي: مصر • نخدم عملاءنا في السعودية، الإمارات، الخليج وكافة دول العالم'
                : 'HQ: Egypt • Serving Saudi Arabia, UAE, GCC & Worldwide Clients'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
