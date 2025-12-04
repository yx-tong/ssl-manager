import client from './client'
import type { Domain } from 'api-shared'

export type { Domain }

export const domainsAPI = {
  getAll: () =>
    client.get<Domain[]>('/api/domains'),
    
  getById: (id: number) =>
    client.get<Domain>(`/api/domains/${id}`),
    
  create: (data: Partial<Domain>) =>
    client.post<Domain>('/api/domains', data),
    
  update: (id: number, data: Partial<Domain>) =>
    client.put<Domain>(`/api/domains/${id}`, data),
    
  delete: (id: number) =>
    client.delete(`/api/domains/${id}`)
}