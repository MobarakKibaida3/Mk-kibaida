import { NextResponse } from 'next/server';
import { getCalculatorPricingRules } from '@/lib/calculatorPricing';

export async function GET() {
  try {
    const rules = await getCalculatorPricingRules();
    return NextResponse.json({
      success: true,
      rules,
    });
  } catch (error) {
    console.error('Error fetching calculator pricing rules:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing rules' }, { status: 500 });
  }
}
