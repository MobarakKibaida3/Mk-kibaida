import { NextRequest, NextResponse } from 'next/server';
import { getServices, updateServices } from '@/lib/storage';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { services, key } = body;

    if (!isAuthorizedAdmin(req.headers, key)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: 'Services array expected' }, { status: 400 });
    }

    const success = await updateServices(services);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating services:', error);
    return NextResponse.json({ error: 'Failed to update services' }, { status: 500 });
  }
}
