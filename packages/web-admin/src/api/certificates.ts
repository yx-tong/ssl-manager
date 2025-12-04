import client from './client'
export interface SSLCertificate {
    id: number
    domain_id: number
    certificate: string
    private_key: string
    status: 'valid' | 'expiring' | 'expired' | 'error'
    expires_at?: string
    issued_at?: string
    created_at: string
    updated_at: string
}

export interface CertificateWithDomain extends SSLCertificate {
    domain_name: string
}

export const certificatesAPI = {
    getAll: () => client.get<CertificateWithDomain[]>('/api/certificates'),

    getById: (id: number) => client.get<CertificateWithDomain>(`/api/certificates/${id}`),

    create: (data: Partial<SSLCertificate>) =>
        client.post<SSLCertificate>('/api/certificates', data),

    updateStatus: (id: number, status: string) =>
        client.put<SSLCertificate>(`/api/certificates/${id}/status`, { status }),

    delete: (id: number) => client.delete(`/api/certificates/${id}`),
}
