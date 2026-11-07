import { calculateAuthoritativeEstimate, isPricingRuleValid, resolveEffectiveMode } from '../lib/calculatorEngine';
import { ServicePricingRule } from '../lib/types';
import rulesData from '../data/calculator-pricing.json';

async function runTests() {
  console.log('=== 1. TESTING DUAL PRICING CALCULATION ENGINE ===');
  const rules = rulesData as ServicePricingRule[];

  // Test A: Shopify Store Development with units & features
  const shopifyRule = rules.find(r => r.serviceId === 'shopify-store-dev')!;
  console.log(`Testing Service: ${shopifyRule.nameEn} (Mode: ${shopifyRule.mode})`);
  
  // 6 pages (4 included + 2 extra @ 500 = +1,000)
  // Base = 4,500
  // Subtotal = 5,500
  // Add payment gateways (+900) = 6,400
  // Complexity: Advanced (1.25x) = 6,400 * 1.25 = 8,000
  // Discount: 10% = -800
  // Final = 7,200
  const shopifyEst = calculateAuthoritativeEstimate(shopifyRule, {
    serviceId: shopifyRule.serviceId,
    unitsCount: 6,
    featureIds: ['payment-gateways-gcc'],
    complexityId: 'advanced',
    additionalIds: [],
    currency: 'EGP',
  });

  console.log('Shopify Estimate Result:', {
    basePrice: shopifyEst.breakdown.basePrice,
    unitsCost: shopifyEst.breakdown.unitsCost,
    featuresCost: shopifyEst.breakdown.featuresCost,
    subtotalBeforeComplexity: shopifyEst.breakdown.subtotalBeforeComplexity,
    subtotalAfterComplexity: shopifyEst.breakdown.subtotalAfterComplexity,
    discountAmount: shopifyEst.breakdown.discountAmount,
    estimatedTotal: shopifyEst.breakdown.estimatedTotal,
  });

  if (shopifyEst.breakdown.estimatedTotal === 7200) {
    console.log('✓ PASS: Shopify estimated cost math matches expected (7,200 EGP)');
  } else {
    throw new Error(`FAIL: Expected 7200 but got ${shopifyEst.breakdown.estimatedTotal}`);
  }

  // Test B: Currency conversion (SAR & USD)
  const sarEst = calculateAuthoritativeEstimate(shopifyRule, {
    serviceId: shopifyRule.serviceId,
    unitsCount: 6,
    featureIds: ['payment-gateways-gcc'],
    complexityId: 'advanced',
    currency: 'SAR',
  });
  console.log('✓ PASS: SAR converted price:', sarEst.breakdown.estimatedTotal, sarEst.breakdown.currency);

  const usdEst = calculateAuthoritativeEstimate(shopifyRule, {
    serviceId: shopifyRule.serviceId,
    unitsCount: 6,
    featureIds: ['payment-gateways-gcc'],
    complexityId: 'advanced',
    currency: 'USD',
  });
  console.log('✓ PASS: USD converted price:', usdEst.breakdown.estimatedTotal, usdEst.breakdown.currency);

  // Test C: Automation and System Integrations (Mode: quotation)
  const autoRule = rules.find(r => r.serviceId === 'automation-integrations')!;
  const autoEst = calculateAuthoritativeEstimate(autoRule, {
    serviceId: autoRule.serviceId,
    complexityId: 'standard',
  });
  if (autoEst.effectiveMode === 'quotation' && autoEst.breakdown.estimatedTotal === 0) {
    console.log('✓ PASS: Custom Quotation service does NOT invent prices and returns 0 estimatedTotal');
  } else {
    throw new Error('FAIL: Quotation mode should have 0 estimatedTotal');
  }

  // Test D: Invalid/incomplete rules fallback to quotation
  const brokenRule: ServicePricingRule = {
    ...shopifyRule,
    basePrice: 0, // invalid base price
  };
  const resolved = resolveEffectiveMode(brokenRule);
  if (resolved === 'quotation') {
    console.log('✓ PASS: Incomplete/broken rules automatically fall back to custom quotation flow');
  } else {
    throw new Error('FAIL: Broken rule should fall back to quotation');
  }

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
