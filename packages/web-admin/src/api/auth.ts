import client from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    username: string
    role: string
  }
}

export const authAPI = {
  login: (data: LoginRequest) =>
    client.post<LoginResponse>('/api/auth/login', data),
    
  logout: () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-username')
  },
    
  getCurrentUser: () =>
    client.get('/api/auth/me')
}