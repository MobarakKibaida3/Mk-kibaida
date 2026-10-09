import { NextRequest, NextResponse } from 'next/server';
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyAdminPassword,
  createAdminSession,
} from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip);

    if (rateCheck.isLocked) {
      return NextResponse.json(
        {
          error: `تم تجاوز الحد المسموح من المحاولات الخاطئة (5 محاولات). تم حظر تسجيل الدخول مؤقتاً. يرجى الانتظار ${rateCheck.remainingMinutes} دقيقة قبل المحاولة مجدداً.`,
          isLocked: true,
          remainingMinutes: rateCheck.remainingMinutes,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'كلمة المرور مطلوبة' }, { status: 400 });
    }

    const isValid = verifyAdminPassword(String(password).trim());

    if (!isValid) {
      const failResult = recordFailedAttempt(ip);
      if (failResult.isNowLocked) {
        return NextResponse.json(
          {
            error: 'تم إدخال كلمة مرور خاطئة 5 مرات. تم حظر المحاولات لمدة 10 دقائق.',
            isLocked: true,
            remainingMinutes: 10,
            remainingAttempts: 0,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `كلمة المرور غير صحيحة. المحاولات المتبقية: ${failResult.remainingAttempts} من 5.`,
          isLocked: false,
          remainingAttempts: failResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Success: clear rate limit counter and issue session token
    clearFailedAttempts(ip);
    const token = createAdminSession();

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}
