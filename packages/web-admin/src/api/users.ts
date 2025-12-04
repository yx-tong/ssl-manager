import client from './client'

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  created_at: string
  last_login?: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

export const usersAPI = {
  getAll: () =>
    client.get<User[]>('/api/users'),
    
  getById: (id: number) =>
    client.get<User>(`/api/users/${id}`),
    
  create: (data: CreateUserRequest) =>
    client.post<User>('/api/users', data),
    
  update: (id: number, data: Partial<User>) =>
    client.put<User>(`/api/users/${id}`, data),
    
  delete: (id: number) =>
    client.delete(`/api/users/${id}`)
}