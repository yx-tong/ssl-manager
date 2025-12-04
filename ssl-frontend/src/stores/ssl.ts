import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Certificate {
  id: string
  domain: string
  issuer: string
  expiryDate: string
  status: 'active' | 'expired' | 'pending'
}

export interface Domain {
  id: string
  name: string
  certificateId?: string
  status: 'active' | 'inactive'
}

export const useSSLStore = defineStore('ssl', () => {
  const certificates = ref<Certificate[]>([])
  const domains = ref<Domain[]>([])
  const loading = ref(false)

  const fetchCertificates = async () => {
    loading.value = true
    try {
      // TODO: 调用后端 API
      certificates.value = [
        {
          id: '1',
          domain: 'example.com',
          issuer: 'Let\'s Encrypt',
          expiryDate: '2024-12-31',
          status: 'active'
        }
      ]
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchDomains = async () => {
    loading.value = true
    try {
      // TODO: 调用后端 API
      domains.value = [
        {
          id: '1',
          name: 'example.com',
          certificateId: '1',
          status: 'active'
        }
      ]
    } catch (error) {
      console.error('Failed to fetch domains:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    certificates,
    domains,
    loading,
    fetchCertificates,
    fetchDomains
  }
})