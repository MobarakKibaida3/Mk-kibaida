import fs from 'fs/promises';
import path from 'path';
import { ServicePricingRule } from './types';

export * from './calculatorEngine';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRICING_FILE = path.join(DATA_DIR, 'calculator-pricing.json');

export async function getCalculatorPricingRules(): Promise<ServicePricingRule[]> {
  try {
    const data = await fs.readFile(PRICING_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading calculator pricing rules:', err);
    return [];
  }
}

export async function saveCalculatorPricingRules(rules: ServicePricingRule[]): Promise<boolean> {
  try {
    await fs.writeFile(PRICING_FILE, JSON.stringify(rules, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving calculator pricing rules:', err);
    return false;
  }
}
