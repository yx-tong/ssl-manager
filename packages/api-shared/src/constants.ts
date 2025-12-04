export const API_ROUTES = {
  DOMAINS: '/api/domains',
  CERTIFICATES: '/api/certificates',
  USERS: '/api/users',
  HEALTH: '/api/health',
  AUTH: '/api/auth'
} as const;

export const CERTIFICATE_STATUS = {
  VALID: 'valid',
  EXPIRING: 'expiring',
  EXPIRED: 'expired'
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export const NOTIFICATION_THRESHOLDS = {
  EXPIRING_DAYS: 30,
  CRITICAL_DAYS: 7
} as const;

export const ERROR_CODES = {
  INVALID_DOMAIN: 'INVALID_DOMAIN',
  CERTIFICATE_NOT_FOUND: 'CERTIFICATE_NOT_FOUND',
  DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;