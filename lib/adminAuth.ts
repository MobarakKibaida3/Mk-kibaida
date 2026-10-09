import crypto from 'crypto';

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
}

// In-memory tracker for failed login attempts
const failedAttempts = new Map<string, AttemptRecord>();

// In-memory active session tokens
const activeSessions = new Map<string, number>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function checkRateLimit(ip: string): { isLocked: boolean; remainingMinutes?: number; remainingAttempts?: number } {
  const record = failedAttempts.get(ip);
  if (!record) {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
  }

  const now = Date.now();
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const remainingMs = record.lockedUntil - now;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return { isLocked: true, remainingMinutes };
    } else {
      // Lockout expired, reset counter
      failedAttempts.delete(ip);
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS };
    }
  }

  return {
    isLocked: false,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.count),
  };
}

export function recordFailedAttempt(ip: string): { isNowLocked: boolean; remainingMinutes?: number; remainingAttempts: number } {
  const now = Date.now();
  const record = failedAttempts.get(ip) || { count: 0, lockedUntil: null };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    failedAttempts.set(ip, record);
    return {
      isNowLocked: true,
      remainingMinutes: 10,
      remainingAttempts: 0,
    };
  }

  failedAttempts.set(ip, record);
  return {
    isNowLocked: false,
    remainingAttempts: MAX_ATTEMPTS - record.count,
  };
}

export function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY || 'MK@2026';
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!password || !expected) return false;
  // Timing safe comparison to prevent timing attacks
  const passBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expected);
  if (passBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(passBuffer, expectedBuffer);
}

export function createAdminSession(): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, Date.now() + SESSION_DURATION_MS);
  return token;
}

export function isValidAdminSession(token: string | null): boolean {
  if (!token) return false;
  const expiry = activeSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

export function isAuthorizedAdmin(reqHeaders: Headers, queryKey?: string | null): boolean {
  const authHeader = reqHeaders.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (isValidAdminSession(token)) return true;
  }

  if (queryKey) {
    if (isValidAdminSession(queryKey)) return true;
    if (verifyAdminPassword(queryKey)) return true;
  }

  return false;
}
