import crypto from "crypto";

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate OTP expiration time (15 minutes from now)
 */
export function generateOTPExpiration(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
}

/**
 * Check if OTP has expired
 */
export function isOTPExpired(expiration: Date): boolean {
  return new Date() > expiration;
}

/**
 * Check if OTP code matches and is not expired
 */
export function isValidOTP(
  providedCode: string,
  storedCode: string | null,
  expiration: Date | null,
): boolean {
  if (!storedCode || !expiration) {
    return false;
  }

  if (isOTPExpired(expiration)) {
    return false;
  }

  return providedCode === storedCode;
}
