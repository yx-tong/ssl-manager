export interface SSLCertificate {
  id: string;
  domain: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  daysUntilExpiry: number;
  status: 'valid' | 'expiring' | 'expired';
  fingerprint: string;
  serialNumber: string;
  san: string[];
  keySize: number;
  signatureAlgorithm: string;
}

export interface Domain {
  id: string;
  name: string;
  certificates: SSLCertificate[];
  lastChecked: Date;
  autoRenew: boolean;
  notificationEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  domains: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}