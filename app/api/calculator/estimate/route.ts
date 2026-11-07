import { NextRequest, NextResponse } from 'next/server';
import { 
  getCalculatorPricingRules, 
  calculateAuthoritativeEstimate,
  resolveEffectiveMode 
} from '@/lib/calculatorPricing';
import { CurrencyCode } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId,
      unitsCount,
      featureIds,
      complexityId,
      additionalIds,
      currency = 'EGP',
    } = body;

    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId is required' }, { status: 400 });
    }

    const rules = await getCalculatorPricingRules();
    const serviceRule = rules.find((r) => r.serviceId === serviceId);

    if (!serviceRule) {
      return NextResponse.json({ error: 'Service not found in pricing rules' }, { status: 404 });
    }

    const effectiveMode = resolveEffectiveMode(serviceRule);

    const calculation = calculateAuthoritativeEstimate(serviceRule, {
      serviceId,
      unitsCount: typeof unitsCount === 'number' ? unitsCount : undefined,
      featureIds: Array.isArray(featureIds) ? featureIds : [],
      complexityId: typeof complexityId === 'string' ? complexityId : 'standard',
      additionalIds: Array.isArray(additionalIds) ? additionalIds : [],
      currency: currency as CurrencyCode,
    });

    return NextResponse.json({
      success: true,
      service: {
        serviceId: serviceRule.serviceId,
        nameAr: serviceRule.nameAr,
        nameEn: serviceRule.nameEn,
        mode: serviceRule.mode,
        effectiveMode,
      },
      ...calculation,
    });
  } catch (error) {
    console.error('Error calculating estimate:', error);
    return NextResponse.json({ error: 'Failed to calculate estimate' }, { status: 500 });
  }
}
