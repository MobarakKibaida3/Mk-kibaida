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

export type OrderStatus = 'new' | 'contacted' | 'in_progress' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderCode: string; // e.g. MK-1001
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
  source: 'direct_form' | 'calculator' | 'exit_popup';
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
  placeholderEn: string;
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
