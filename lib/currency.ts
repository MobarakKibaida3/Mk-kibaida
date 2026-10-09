import settingsData from '@/data/settings.json';
import { CurrencyCode, CurrencyConfig, Language, ServiceQuestion, PaymentMethod } from '@/lib/types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = settingsData.currencies as Record<CurrencyCode, CurrencyConfig>;

export function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
  return CURRENCIES[code] || CURRENCIES.EGP;
}

export function convertPrice(priceInEGP: number, currencyCode: CurrencyCode): {
  amount: number;
  currency: CurrencyConfig;
} {
  const config = getCurrencyConfig(currencyCode);
  if (currencyCode === 'EGP') {
    return { amount: priceInEGP, currency: config };
  }
  // Convert based on exchange rate
  const converted = Math.round(priceInEGP * config.rateFromEGP);
  return {
    amount: Math.max(1, converted),
    currency: config,
  };
}

export function formatPriceWithCurrency(
  priceInEGP: number,
  currencyCode: CurrencyCode,
  lang: Language
): {
  amountString: string;
  symbol: string;
  name: string;
  fullLabel: string;
} {
  const { amount, currency } = convertPrice(priceInEGP, currencyCode);
  const amountString = amount.toLocaleString();
  const symbol = lang === 'ar' ? currency.symbolAr : currency.symbolEn;
  const name = lang === 'ar' ? currency.nameAr : currency.nameEn;
  const fullLabel = `${amountString} ${symbol}`;

  return {
    amountString,
    symbol,
    name,
    fullLabel,
  };
}

export function getServiceQuestions(serviceId: string): ServiceQuestion[] {
  const questionsMap = settingsData.serviceQuestions as Record<string, ServiceQuestion[]>;
  return questionsMap[serviceId] || questionsMap.default || [];
}

export function getPaymentMethods(): PaymentMethod[] {
  return (settingsData.paymentMethods || []) as PaymentMethod[];
}
