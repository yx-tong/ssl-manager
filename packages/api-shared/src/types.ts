export interface SSLCertificate {
  id: number;
  domain_id: number;
  certificate: string;
  private_key: string;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  issued_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
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