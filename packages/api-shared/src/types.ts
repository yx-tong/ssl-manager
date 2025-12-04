export interface SSLCertificate {
  id: number | string;
  domain_id?: number;
  domain: string;
  certificate?: string;
  private_key?: string;
  status: 'active' | 'expired' | 'revoked' | 'pending' | 'valid' | 'expiring';
  issued_at?: string;
  expires_at?: string;
  validFrom?: Date;
  validTo?: Date;
  daysUntilExpiry?: number;
  issuer?: string;
  subject?: string;
  fingerprint?: string;
  serialNumber?: string;
  san?: string[];
  keySize?: number;
  signatureAlgorithm?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Domain {
  id: number;
  domain: string;
  name?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  expires_at?: string;
  lastChecked?: Date;
  autoRenew?: boolean;
  notificationEnabled?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
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
