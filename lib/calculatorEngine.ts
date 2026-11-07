import { 
  ServicePricingRule, 
  PriceBreakdown, 
  CurrencyCode 
} from './types';
import { convertPrice } from './currency';

/**
 * Validates whether a service pricing rule has complete and sound parameters.
 * If basePrice <= 0 or critical multipliers are missing, mode automatically falls back to 'quotation'.
 */
export function isPricingRuleValid(rule: ServicePricingRule | undefined): boolean {
  if (!rule || !rule.enabled) return false;
  if (rule.mode === 'quotation') return true;
  
  // For estimate or hybrid mode:
  if (rule.basePrice <= 0) return false;
  if (!rule.complexityOptions || rule.complexityOptions.length === 0) return false;
  return true;
}

export function resolveEffectiveMode(rule: ServicePricingRule | undefined): 'estimate' | 'quotation' | 'hybrid' {
  if (!rule || !rule.enabled) return 'quotation';
  if (rule.mode === 'quotation') return 'quotation';
  
  // If rules are incomplete or invalid, automatically fall back to custom quotation flow!
  if (!isPricingRuleValid(rule)) {
    return 'quotation';
  }
  
  return rule.mode;
}

export interface CalculateEstimateParams {
  serviceId: string;
  unitsCount?: number;
  featureIds?: string[];
  complexityId?: string;
  additionalIds?: string[];
  currency?: CurrencyCode;
}

export function calculateAuthoritativeEstimate(
  rule: ServicePricingRule,
  params: CalculateEstimateParams
): {
  breakdown: PriceBreakdown;
  effectiveMode: 'estimate' | 'quotation' | 'hybrid';
  isValid: boolean;
} {
  const effectiveMode = resolveEffectiveMode(rule);

  if (effectiveMode === 'quotation') {
    const emptyBreakdown: PriceBreakdown = {
      basePrice: 0,
      unitsCost: 0,
      featuresCost: 0,
      additionalCost: 0,
      subtotalBeforeComplexity: 0,
      complexityId: params.complexityId || 'standard',
      complexityMultiplier: 1.0,
      subtotalAfterComplexity: 0,
      discountPercentage: 0,
      discountAmount: 0,
      estimatedTotal: 0,
      currency: params.currency || 'EGP',
    };
    return {
      breakdown: emptyBreakdown,
      effectiveMode: 'quotation',
      isValid: true,
    };
  }

  // 1. Base Price (in rule's base currency, usually EGP)
  const basePriceEGP = rule.basePrice;

  // 2. Units calculation
  let extraUnits = 0;
  let unitsCostEGP = 0;
  const requestedUnits = Math.max(rule.minUnits || 1, Math.min(params.unitsCount ?? rule.baseUnitsIncluded ?? 1, rule.maxUnits || 100));

  if (rule.hasUnits && requestedUnits > (rule.baseUnitsIncluded || 0)) {
    extraUnits = requestedUnits - (rule.baseUnitsIncluded || 0);
    unitsCostEGP = extraUnits * (rule.pricePerAdditionalUnit || 0);
  }

  // 3. Features
  const selectedFeatureIds = params.featureIds || [];
  const selectedFeatures = (rule.features || []).filter((f) => selectedFeatureIds.includes(f.id));
  const featuresCostEGP = selectedFeatures.reduce((sum, f) => sum + (f.price || 0), 0);

  // 4. Additional Services
  const selectedAdditionalIds = params.additionalIds || [];
  const selectedAdditional = (rule.additionalServices || []).filter((a) => selectedAdditionalIds.includes(a.id));
  const additionalCostEGP = selectedAdditional.reduce((sum, a) => sum + (a.price || 0), 0);

  // 5. Subtotal before complexity
  const subtotalBeforeCompEGP = basePriceEGP + unitsCostEGP + featuresCostEGP + additionalCostEGP;

  // 6. Complexity Multiplier
  const chosenComplexityId = params.complexityId || 'standard';
  const compOption = (rule.complexityOptions || []).find((c) => c.id === chosenComplexityId) || {
    id: 'standard',
    multiplier: 1.0,
  };
  const multiplier = compOption.multiplier || 1.0;
  const subtotalAfterCompEGP = Math.round(subtotalBeforeCompEGP * multiplier);

  // 7. Discount
  const discountPct = rule.discountPercentage || 0;
  const discountAmountEGP = Math.round((subtotalAfterCompEGP * discountPct) / 100);
  const finalTotalEGP = Math.max(0, subtotalAfterCompEGP - discountAmountEGP);

  // Target currency conversion (EGP / SAR / USD)
  const targetCurrency = params.currency || rule.currency || 'EGP';

  const basePriceConv = convertPrice(basePriceEGP, targetCurrency).amount;
  const unitsCostConv = convertPrice(unitsCostEGP, targetCurrency).amount;
  const featuresCostConv = convertPrice(featuresCostEGP, targetCurrency).amount;
  const additionalCostConv = convertPrice(additionalCostEGP, targetCurrency).amount;
  const subtotalBeforeConv = convertPrice(subtotalBeforeCompEGP, targetCurrency).amount;
  const subtotalAfterConv = convertPrice(subtotalAfterCompEGP, targetCurrency).amount;
  const discountAmountConv = convertPrice(discountAmountEGP, targetCurrency).amount;
  const estimatedTotalConv = convertPrice(finalTotalEGP, targetCurrency).amount;

  const breakdown: PriceBreakdown = {
    basePrice: basePriceConv,
    unitsCount: requestedUnits,
    baseUnitsIncluded: rule.baseUnitsIncluded,
    extraUnitsCount: extraUnits,
    pricePerUnit: convertPrice(rule.pricePerAdditionalUnit || 0, targetCurrency).amount,
    unitsCost: unitsCostConv,
    featuresCost: featuresCostConv,
    additionalCost: additionalCostConv,
    subtotalBeforeComplexity: subtotalBeforeConv,
    complexityId: compOption.id,
    complexityMultiplier: multiplier,
    subtotalAfterComplexity: subtotalAfterConv,
    discountPercentage: discountPct,
    discountAmount: discountAmountConv,
    estimatedTotal: estimatedTotalConv,
    currency: targetCurrency,
  };

  return {
    breakdown,
    effectiveMode,
    isValid: true,
  };
}
