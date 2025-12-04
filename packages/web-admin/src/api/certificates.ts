import client from './client'
import type { SSLCertificate } from 'api-shared'

export interface CertificateWithDomain extends SSLCertificate {
  domain_name: string
}

export const certificatesAPI = {
  getAll: () =>
    client.get<CertificateWithDomain[]>('/api/certificates'),
    
  getById: (id: number) =>
    client.get<CertificateWithDomain>(`/api/certificates/${id}`),
    
  create: (data: Partial<SSLCertificate>) =>
    client.post<SSLCertificate>('/api/certificates', data),
    
  updateStatus: (id: number, status: string) =>
    client.put<SSLCertificate>(`/api/certificates/${id}/status`, { status }),
    
  delete: (id: number) =>
    client.delete(`/api/certificates/${id}`)
}