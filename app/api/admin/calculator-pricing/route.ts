import { NextRequest, NextResponse } from 'next/server';
import { getCalculatorPricingRules, saveCalculatorPricingRules } from '@/lib/calculatorPricing';
import { isAuthorizedAdmin } from '@/lib/adminAuth';
import { ServicePricingRule } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!isAuthorizedAdmin(req.headers, key)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await getCalculatorPricingRules();
    return NextResponse.json({ success: true, rules });
  } catch (error) {
    console.error('Error fetching admin calculator pricing rules:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!isAuthorizedAdmin(req.headers, key)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { rules } = body;

    if (!Array.isArray(rules)) {
      return NextResponse.json({ error: 'rules must be an array' }, { status: 400 });
    }

    const success = await saveCalculatorPricingRules(rules as ServicePricingRule[]);
    if (!success) {
      return NextResponse.json({ error: 'Failed to write pricing rules' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Calculator pricing rules updated successfully' });
  } catch (error) {
    console.error('Error updating admin calculator pricing rules:', error);
    return NextResponse.json({ error: 'Failed to update rules' }, { status: 500 });
  }
}
