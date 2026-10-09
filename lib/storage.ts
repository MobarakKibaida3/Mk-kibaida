import fs from 'fs/promises';
import path from 'path';
import { Order, ServiceItem } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');

// Ensure data folder and orders.json exist
async function ensureFilesExist() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Already exists
  }

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    const initialOrders: Order[] = [
      {
        id: 'ord_1',
        orderCode: 'MK-1001',
        fullName: 'أحمد محمود العتيبي',
        phone: '0501234567',
        countryCode: '+966',
        email: 'ahmed.alotaibi@example.com',
        serviceId: 'full-store-bundle',
        serviceNameAr: 'باقة المتجر الكامل: تصميم المتجر + الثيم + ملف التصدير',
        serviceNameEn: 'Full Store Master Bundle: Design + Theme + Export',
        price: 6000,
        finalPrice: 6000,
        details: 'متجر عطور فاخرة بحاجة إلى ثيم أسود وذهبي مع صفحات هبوط للمنتجات الحصرية.',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        source: 'direct_form',
      },
      {
        id: 'ord_2',
        orderCode: 'MK-1002',
        fullName: 'كريم الشناوي',
        phone: '01098765432',
        countryCode: '+20',
        email: 'karim.shenawy@example.com',
        serviceId: 'ai-products-store',
        serviceNameAr: 'تصميم منتجات بالذكاء الاصطناعي + تصميم متاجر',
        serviceNameEn: 'AI Product Design + Store Creation',
        price: 3000,
        finalPrice: 3000,
        details: 'براند ملابس وأحذية رياضية، نحتاج 12 موك أب بالذكاء الاصطناعي مع تقسيم المتجر.',
        status: 'delivered',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        source: 'direct_form',
      },
      {
        id: 'ord_3',
        orderCode: 'MK-1003',
        fullName: 'سارة عبد الله الفهد',
        phone: '0558765432',
        countryCode: '+966',
        email: 'sara.alfahad@example.com',
        serviceId: 'logo-design',
        serviceNameAr: 'تصميم لوجو احترافي',
        serviceNameEn: 'Custom Brand Logo Design',
        price: 1500,
        finalPrice: 1500,
        details: 'شعار أنيق لبراند مجوهرات نسائية يحمل حرف S بتاج ملكي.',
        status: 'contacted',
        createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        source: 'direct_form',
      },
    ];
    await fs.writeFile(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), 'utf-8');
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureFilesExist();
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

export async function saveOrder(orderData: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'status'>): Promise<Order> {
  await ensureFilesExist();
  const orders = await getOrders();
  
  // Generate sequence code e.g. MK-1004
  const nextNumber = 1001 + orders.length;
  const orderCode = `MK-${nextNumber}`;
  
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderCode,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  await ensureFilesExist();
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId || o.orderCode === orderId);
  if (index === -1) return null;

  orders[index].status = status;
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  await ensureFilesExist();
  const orders = await getOrders();
  const cleanCode = code.trim().toUpperCase();
  return orders.find((o) => o.orderCode.toUpperCase() === cleanCode) || null;
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const data = await fs.readFile(SERVICES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

export async function updateServices(services: ServiceItem[]): Promise<boolean> {
  try {
    await fs.writeFile(SERVICES_FILE, JSON.stringify(services, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing services:', error);
    return false;
  }
}
