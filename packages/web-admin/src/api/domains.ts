import client from './client'
export interface Domain {
    id: number
    domain: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export const domainsAPI = {
    getAll: () => client.get<Domain[]>('/api/domains'),

    getById: (id: number) => client.get<Domain>(`/api/domains/${id}`),

    create: (data: Partial<Domain>) => client.post<Domain>('/api/domains', data),

    update: (id: number, data: Partial<Domain>) => client.put<Domain>(`/api/domains/${id}`, data),

    delete: (id: number) => client.delete(`/api/domains/${id}`),
}
