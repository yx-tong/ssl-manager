import type { SSLCertificate } from './types';

export function calculateDaysUntilExpiry(validTo: Date): number {
  const now = new Date();
  const expiry = new Date(validTo);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getCertificateStatus(certificate: SSLCertificate): 'valid' | 'expiring' | 'expired' {
  if (!certificate.expires_at) {
    return 'valid'; // 如果没有过期时间，默认返回有效
  }
  const daysUntilExpiry = calculateDaysUntilExpiry(new Date(certificate.expires_at));
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring';
  } else {
    return 'valid';
  }
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  return domainRegex.test(domain) && domain.length <= 253;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateTime(date: Date): string {
  return date.toISOString();
}

export function createApiResponse<T>(success: boolean, data?: T, error?: string, message?: string) {
  return {
    success,
    data,
    error,
    message
  };
}

export function createErrorResponse(error: string, message?: string) {
  return createApiResponse(false, undefined, error, message);
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return createApiResponse(true, data, undefined, message);
}
