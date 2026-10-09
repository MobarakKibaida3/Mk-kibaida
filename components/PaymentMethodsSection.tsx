'use client';

import React, { useState } from 'react';
import { getPaymentMethods } from '@/lib/currency';
import { Language, PaymentMethod } from '@/lib/types';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Globe2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock,
  Wallet,
  Zap,
  Info
} from 'lucide-react';

interface PaymentMethodsSectionProps {
  lang: Language;
}

export default function PaymentMethodsSection({ lang }: PaymentMethodsSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const paymentMethods = getPaymentMethods();
  const isRtl = lang === 'ar';

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'instapay':
        return <Zap className="w-5 h-5 text-[#C9A227]" />;
      case 'bank':
        return <Building2 className="w-5 h-5 text-[#C9A227]" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-[#C9A227]" />;
      case 'international':
        return <Globe2 className="w-5 h-5 text-[#C9A227]" />;
      default:
        return <CreditCard className="w-5 h-5 text-[#C9A227]" />;
    }
  };

  return (
    <section id="payment-methods" className="py-20 bg-[#070707] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191919] border border-[#C9A227]/30 text-[#C9A227] text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar' ? 'وسائل دفع مرنة ومعتمدة' : 'Verified & Secure Payment'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif mb-4 tracking-tight">
            {lang === 'ar' ? 'طرق الدفع والتحويل المعتمدة' : 'Accepted Payment Methods'}
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {lang === 'ar'
              ? 'نوفر خيارات دفع آمنة وسلسة لعملائنا في مصر والمملكة العربية السعودية ودول الخليج وحول العالم. لا نطلب أي دفع مسبق قبل الاتفاق ومراجعة متطلبات مشروعك عبر واتساب.'
              : 'Flexible and secure payment options for our clients in Egypt, Saudi Arabia, the GCC, and worldwide. Zero advance payment requested prior to reviewing your brief on WhatsApp.'}
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method) => {
            const name = lang === 'ar' ? method.nameAr : method.nameEn;
            const badge = lang === 'ar' ? method.badgeAr : method.badgeEn;
            const instructions = lang === 'ar' ? method.instructionsAr : method.instructionsEn;
            const hasSpecificData = Boolean(method.accountNumber || method.iban || method.accountName);

            return (
              <div
                key={method.id}
                className="rounded-2xl bg-[#121212] border border-neutral-800/90 hover:border-[#C9A227]/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-lg group hover:bg-[#151515]"
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0A0A0A] border border-[#C9A227]/30 flex items-center justify-center shrink-0 group-hover:border-[#C9A227] transition-colors">
                      {getMethodIcon(method.type)}
                    </div>
                    {badge && (
                      <span className="text-[10px] font-bold text-[#E5C158] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/30">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Method Title */}
                  <h3 className="text-base font-bold text-white font-serif mb-2 group-hover:text-[#E5C158] transition-colors">
                    {name}
                  </h3>

                  {/* Description / Instructions */}
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    {instructions}
                  </p>
                </div>

                {/* Account Details or Empty Placeholder */}
                <div className="pt-4 border-t border-neutral-800/80 mt-2">
                  {hasSpecificData ? (
                    <div className="space-y-2 bg-[#0A0A0A] p-3 rounded-xl border border-neutral-800 text-xs font-mono">
                      {method.accountName && (
                        <div className="flex justify-between items-center text-neutral-300">
                          <span className="text-[11px] text-neutral-500 font-sans">
                            {lang === 'ar' ? 'الاسم:' : 'Name:'}
                          </span>
                          <span className="font-bold text-white">{method.accountName}</span>
                        </div>
                      )}
                      {method.accountNumber && (
                        <div className="flex justify-between items-center text-neutral-300">
                          <span className="text-[11px] text-neutral-500 font-sans">
                            {lang === 'ar' ? 'الرقم:' : 'Number:'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#E5C158]">{method.accountNumber}</span>
                            <button
                              onClick={() => handleCopy(method.accountNumber, `${method.id}-num`)}
                              className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                              title="نسخ"
                            >
                              {copiedId === `${method.id}-num` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                      {method.iban && (
                        <div className="flex justify-between items-center text-neutral-300">
                          <span className="text-[11px] text-neutral-500 font-sans">IBAN:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#E5C158] truncate max-w-[140px]">{method.iban}</span>
                            <button
                              onClick={() => handleCopy(method.iban, `${method.id}-iban`)}
                              className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                              title="نسخ"
                            >
                              {copiedId === `${method.id}-iban` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Default state when settings fields are empty (as requested) */
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0A0A] border border-dashed border-neutral-800 text-[11px] text-neutral-400">
                      <Info className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                      <span>
                        {lang === 'ar'
                          ? 'تُزوّد بالبيانات الرسمية ورقم التحويل فور تأكيد طلبك عبر واتساب'
                          : 'Official transfer details provided upon order confirmation on WhatsApp'}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Security guarantee note */}
        <div className="mt-12 p-4 rounded-2xl bg-[#0D0D0D] border border-neutral-800 text-center max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-neutral-400">
          <Lock className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span>
            {lang === 'ar'
              ? 'معاملات مباشرة وآمنة 100% · لا توجد أي اشتراكات أو خصومات تلقائية مستمرة'
              : '100% Direct and Safe · Zero automatic recurring deductions or hidden charges'}
          </span>
        </div>

      </div>
    </section>
  );
}
