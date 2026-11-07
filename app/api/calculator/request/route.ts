import { NextRequest, NextResponse } from 'next/server';
import { saveOrder, getOrders } from '@/lib/storage';
import { 
  getCalculatorPricingRules, 
  calculateAuthoritativeEstimate,
  resolveEffectiveMode 
} from '@/lib/calculatorPricing';
import { CurrencyCode, Order, OrderStatus } from '@/lib/types';
import { getCurrencyConfig } from '@/lib/currency';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      countryCode = '+20',
      email = '',
      serviceId,
      unitsCount,
      featureIds = [],
      complexityId = 'standard',
      additionalIds = [],
      currency = 'EGP',
      budgetRange = '',
      preferredDeadline = '',
      specialRequirements = '',
      attachmentUrl = '',
      pricingModeSelected = 'estimate', // 'estimate' or 'quotation'
      honeypot,
    } = body;

    // Honeypot spam check
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Input Validation
    if (!fullName || String(fullName).trim().length < 2) {
      return NextResponse.json({ error: 'يرجى كتابة الاسم الكامل (حرفان على الأقل)' }, { status: 400 });
    }

    if (!phone || String(phone).trim().length < 6) {
      return NextResponse.json({ error: 'يرجى كتابة رقم هاتف / واتساب صالح' }, { status: 400 });
    }

    if (!serviceId) {
      return NextResponse.json({ error: 'يرجى تحديد الخدمة المطلوبة' }, { status: 400 });
    }

    // Fetch pricing rule
    const rules = await getCalculatorPricingRules();
    const serviceRule = rules.find((r) => r.serviceId === serviceId);

    if (!serviceRule) {
      return NextResponse.json({ error: 'الخدمة المختارة غير معرّفة في النظام' }, { status: 404 });
    }

    const effectiveMode = resolveEffectiveMode(serviceRule);
    const isQuotation = effectiveMode === 'quotation' || pricingModeSelected === 'quotation';

    let authoritativeFinalPrice = 0;
    let authoritativeBasePrice = 0;
    let priceBreakdownObj = undefined;

    if (!isQuotation) {
      const calc = calculateAuthoritativeEstimate(serviceRule, {
        serviceId,
        unitsCount: typeof unitsCount === 'number' ? unitsCount : undefined,
        featureIds,
        complexityId,
        additionalIds,
        currency: currency as CurrencyCode,
      });
      authoritativeFinalPrice = calc.breakdown.estimatedTotal;
      authoritativeBasePrice = calc.breakdown.basePrice;
      priceBreakdownObj = calc.breakdown;
    }

    // Generate custom sequence code: MK-Q100X for quotation requests, MK-100X for estimates
    const existingOrders = await getOrders();
    const nextNum = 1001 + existingOrders.length;
    const orderCodePrefix = isQuotation ? 'MK-Q' : 'MK-';
    const orderCode = `${orderCodePrefix}${nextNum}`;

    // Collect readable summaries for WhatsApp and order details
    const currConf = getCurrencyConfig(currency as CurrencyCode);
    const selectedFeaturesList = (serviceRule.features || [])
      .filter((f) => featureIds.includes(f.id))
      .map((f) => `▪ ${f.nameAr}`);

    const selectedAddonsList = (serviceRule.additionalServices || [])
      .filter((a) => additionalIds.includes(a.id))
      .map((a) => `▪ ${a.nameAr}`);

    const compName = (serviceRule.complexityOptions || []).find((c) => c.id === complexityId)?.nameAr || 'قياسي';

    let detailsSummary = `طلب حاسبة التكاليف الذكية (${isQuotation ? 'عرض سعر مخصص' : 'تقدير تكلفة فوري'})\n`;
    if (serviceRule.hasUnits && unitsCount) {
      detailsSummary += `الكمية / الحجم: ${unitsCount} ${serviceRule.unitLabelAr || ''}\n`;
    }
    detailsSummary += `مستوى التعقيد: ${compName}\n`;
    if (selectedFeaturesList.length > 0) {
      detailsSummary += `الميزات المطلوبة:\n${selectedFeaturesList.join('\n')}\n`;
    }
    if (selectedAddonsList.length > 0) {
      detailsSummary += `خدمات إضافية:\n${selectedAddonsList.join('\n')}\n`;
    }
    if (budgetRange) {
      detailsSummary += `الميزانية المقترحة: ${budgetRange}\n`;
    }
    if (preferredDeadline) {
      detailsSummary += `الموعد المرغوب للتسليم: ${preferredDeadline}\n`;
    }
    if (specialRequirements) {
      detailsSummary += `متطلبات خاصة:\n${specialRequirements}\n`;
    }
    if (attachmentUrl) {
      detailsSummary += `روابط / ملفات مرفقة: ${attachmentUrl}\n`;
    }

    const initialStatus: OrderStatus = isQuotation ? 'new' : 'new';

    const orderData: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'status'> & { orderCode?: string } = {
      orderCode,
      fullName: String(fullName).trim(),
      phone: String(phone).trim(),
      countryCode,
      email: email ? String(email).trim() : undefined,
      serviceId: serviceRule.serviceId,
      serviceNameAr: serviceRule.nameAr,
      serviceNameEn: serviceRule.nameEn,
      price: authoritativeBasePrice,
      finalPrice: authoritativeFinalPrice,
      details: detailsSummary.trim(),
      source: 'smart_calculator',
      requestType: isQuotation ? 'quotation_request' : 'smart_estimate',
      pricingMode: effectiveMode,
      budgetRange: budgetRange || undefined,
      preferredDeadline: preferredDeadline || undefined,
      calculatorSelections: {
        serviceId: serviceRule.serviceId,
        unitsCount: serviceRule.hasUnits ? unitsCount : undefined,
        complexity: complexityId,
        features: featureIds,
        additionalServices: additionalIds,
        budgetRange,
        preferredDeadline,
        specialRequirements,
        attachmentUrl,
        priceBreakdown: priceBreakdownObj,
      },
    };

    // Save into existing storage
    const saved = await saveOrder(orderData as Parameters<typeof saveOrder>[0]);

    // Format WhatsApp Message
    const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;
    const pricingText = isQuotation
      ? `السعر: يتطلب عرض سعر مخصص وفق متطلبات المشروع`
      : `التقدير التكليفي المحسوب: ${authoritativeFinalPrice.toLocaleString()} ${currConf.symbolAr} (${currConf.nameAr})`;

    const waText = 
`طلب جديد #${saved.orderCode} (${isQuotation ? 'طلب عرض سعر مخصص' : 'تقدير تكلفة فوري'})
━━━━━━━━━━━━
الاسم: ${saved.fullName}
الهاتف: ${fullPhone}
الخدمة: ${saved.serviceNameAr}
${pricingText}
العملة: ${currConf.nameAr} (${currConf.code})

تفاصيل الاختيارات والمتطلبات:
${saved.details}

${saved.email ? `البريد الإلكتروني: ${saved.email}\n` : ''}أرغب في متابعة التفاصيل والبدء بالتنسيق معكم.`;

    const waUrl = `https://wa.me/201033615727?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      order: saved,
      whatsappUrl: waUrl,
      isQuotation,
    });
  } catch (error) {
    console.error('Error saving calculator request:', error);
    return NextResponse.json({ error: 'Failed to submit calculator request' }, { status: 500 });
  }
}
