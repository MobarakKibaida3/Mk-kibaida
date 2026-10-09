import { NextRequest, NextResponse } from 'next/server';
import { getOrderByCode } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Order code is required' }, { status: 400 });
    }

    const order = await getOrderByCode(code);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return sanitized status info for the client
    return NextResponse.json({
      orderCode: order.orderCode,
      serviceNameAr: order.serviceNameAr,
      serviceNameEn: order.serviceNameEn,
      price: order.finalPrice,
      status: order.status,
      createdAt: order.createdAt,
      clientName: order.fullName.split(' ')[0], // First name only for privacy
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Failed to query order' }, { status: 500 });
  }
}
