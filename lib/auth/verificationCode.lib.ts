/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}
/**
 * Get expiry time (10 minutes from now)
 */
export function getVerificationCodeExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}
