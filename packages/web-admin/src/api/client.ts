import axios from 'axios'
import { ElMessage } from 'element-plus'

const API_BASE_URL = (import.meta as any).env?.PROD
    ? 'https://ssl-service.xez.workers.dev/'
    : 'http://localhost:8787'

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('admin-token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
client.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin-token')
            localStorage.removeItem('admin-username')
            window.location.href = '/login'
            ElMessage.error('Session expired, please login again')
        } else if (error.response?.data?.error) {
            ElMessage.error(error.response.data.error)
        } else {
            ElMessage.error('Network error, please try again')
        }
        return Promise.reject(error)
    }
)

export default client
