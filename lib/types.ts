export type ServiceCategory = 'core' | 'extended';

export interface ServiceItem {
  id: string;
  number: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  durationAr: string;
  durationEn: string;
  category: ServiceCategory;
  unitAr?: string;
  unitEn?: string;
  badge?: string;
  badgeEn?: string;
  highlightsAr?: string[];
  highlightsEn?: string[];
  popular?: boolean;
}

export type OrderStatus = 'new' | 'contacted' | 'quoted' | 'in_progress' | 'delivered' | 'cancelled';

export interface PriceBreakdown {
  basePrice: number;
  unitsCount?: number;
  baseUnitsIncluded?: number;
  extraUnitsCount?: number;
  pricePerUnit?: number;
  unitsCost: number;
  featuresCost: number;
  additionalCost: number;
  subtotalBeforeComplexity: number;
  complexityId: string;
  complexityMultiplier: number;
  subtotalAfterComplexity: number;
  discountPercentage: number;
  discountAmount: number;
  estimatedTotal: number;
  currency: CurrencyCode;
}

export interface CalculatorSelections {
  serviceId: string;
  unitsCount?: number;
  complexity?: string;
  features?: string[];
  additionalServices?: string[];
  budgetRange?: string;
  preferredDeadline?: string;
  specialRequirements?: string;
  attachmentUrl?: string;
  priceBreakdown?: PriceBreakdown;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. MK-1001 or MK-Q1001
  fullName: string;
  phone: string;
  countryCode: string;
  email?: string;
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  price: number;
  discountCode?: string;
  finalPrice: number;
  details: string;
  status: OrderStatus;
  createdAt: string;
  source: 'direct_form' | 'calculator' | 'smart_calculator' | 'exit_popup';
  requestType?: 'direct_order' | 'quotation_request' | 'smart_estimate';
  pricingMode?: 'estimate' | 'quotation' | 'hybrid';
  budgetRange?: string;
  preferredDeadline?: string;
  quotedPrice?: number;
  estimatedDelivery?: string;
  adminNotes?: string;
  calculatorSelections?: CalculatorSelections;
}

export type Language = 'ar' | 'en';

export type CurrencyCode = 'EGP' | 'SAR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbolAr: string;
  symbolEn: string;
  nameAr: string;
  nameEn: string;
  rateFromEGP: number;
}

export interface ServiceQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  placeholderAr: string;
  placeholderEn?: string;
  required?: boolean;
}

export interface PaymentMethod {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'instapay' | 'bank' | 'wallet' | 'international';
  badgeAr?: string;
  badgeEn?: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  bankName: string;
  instructionsAr: string;
  instructionsEn: string;
}

export type PricingMode = 'estimate' | 'quotation' | 'hybrid';

export interface CalculatorFeatureOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
}

export interface CalculatorComplexityOption {
  id: 'standard' | 'advanced' | 'enterprise';
  nameAr: string;
  nameEn: string;
  multiplier: number;
}

export interface ServicePricingRule {
  serviceId: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  mode: PricingMode;
  enabled: boolean;
  currency: CurrencyCode;
  basePrice: number;
  hasUnits: boolean;
  unitType?: 'pages' | 'items' | 'models' | 'workflows' | 'campaigns';
  unitLabelAr?: string;
  unitLabelEn?: string;
  baseUnitsIncluded: number;
  pricePerAdditionalUnit: number;
  minUnits: number;
  maxUnits: number;
  features: CalculatorFeatureOption[];
  complexityOptions: CalculatorComplexityOption[];
  additionalServices: CalculatorFeatureOption[];
  discountPercentage: number;
}
