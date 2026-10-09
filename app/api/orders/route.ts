import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder, updateOrderStatus } from '@/lib/storage';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!isAuthorizedAdmin(req.headers, key)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      countryCode = '+20',
      email = '',
      serviceId,
      serviceNameAr,
      serviceNameEn,
      price,
      discountCode = '',
      finalPrice,
      currencyCode = 'EGP',
      currencyName = 'جنيه مصري',
      currencySymbol = 'ج.م',
      details,
      source = 'direct_form',
      honeypot,
    } = body;

    // Honeypot spam check
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters' }, { status: 400 });
    }

    if (!phone || phone.trim().length < 6) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    if (!serviceNameAr || !price) {
      return NextResponse.json({ error: 'Service selection is required' }, { status: 400 });
    }

    if (!details || details.trim().length < 5) {
      return NextResponse.json({ error: 'Project details are required' }, { status: 400 });
    }

    const saved = await saveOrder({
      fullName: fullName.trim(),
      phone: phone.trim(),
      countryCode,
      email: email ? email.trim() : undefined,
      serviceId: serviceId || 'custom',
      serviceNameAr,
      serviceNameEn: serviceNameEn || serviceNameAr,
      price: Number(price),
      discountCode: discountCode ? discountCode.trim() : undefined,
      finalPrice: Number(finalPrice || price),
      details: details.trim(),
      source,
    });

    // Generate WhatsApp encoded URL with currency & custom questions included
    const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;
    const waText = 
`طلب جديد #${saved.orderCode}
━━━━━━━━━━━━
الاسم: ${saved.fullName}
الهاتف: ${fullPhone}
الخدمة: ${saved.serviceNameAr}
السعر: ${saved.finalPrice} ${currencyName} (${currencySymbol})
العملة: ${currencyName} (${currencyCode})

التفاصيل وبيانات الخدمة:
${saved.details}

الملفات: سأرسل الملفات والصور المرجعية في هذه المحادثة
${saved.email ? `البريد: ${saved.email}\n` : ''}${saved.discountCode ? `كود الخصم: ${saved.discountCode}\n` : ''}`;

    const waUrl = `https://wa.me/201033615727?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      order: saved,
      whatsappUrl: waUrl,
    });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, key } = body;

    if (!isAuthorizedAdmin(req.headers, key)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
