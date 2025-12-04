import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SSLCertificate } from '@/api/certificates'
import { ElMessage } from 'element-plus'

export const useCertificatesStore = defineStore('adminCertificates', () => {
  const certificates = ref<SSLCertificate[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const fetchCertificates = async (page = 1, limit = 10) => {
    loading.value = true

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockCertificates: SSLCertificate[] = [
        {
          id: '1',
          domain: 'example.com',
          issuer: "Let's Encrypt",
          subject: 'example.com',
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
          daysUntilExpiry: 30,
          status: 'expiring',
          fingerprint: 'abc123',
          serialNumber: '123456789',
          san: ['www.example.com'],
          keySize: 2048,
          signatureAlgorithm: 'SHA256withRSA',
        },
        {
          id: '2',
          domain: 'test.com',
          issuer: "Let's Encrypt",
          subject: 'test.com',
          validFrom: new Date('2024-06-01'),
          validTo: new Date('2025-06-01'),
          daysUntilExpiry: 180,
          status: 'valid',
          fingerprint: 'def456',
          serialNumber: '987654321',
          san: ['www.test.com', 'api.test.com'],
          keySize: 2048,
          signatureAlgorithm: 'SHA256withRSA',
        },
      ]

      certificates.value = mockCertificates
      total.value = mockCertificates.length
      currentPage.value = page
      pageSize.value = limit
    } catch (error) {
      ElMessage.error('Failed to fetch certificates')
      throw error
    } finally {
      loading.value = false
    }
  }

  const getCertificateById = (id: number) => {
    return certificates.value.find(cert => cert.id === id)
  }

  const getCertificatesByDomain = (domain: string) => {
    return certificates.value.filter(cert => cert.domain === domain)
  }

  const refreshCertificate = async (certificateId: number) => {
    loading.value = true

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      ElMessage.success('Certificate refreshed successfully')
    } catch (error) {
      ElMessage.error('Failed to refresh certificate')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    certificates,
    loading,
    total,
    currentPage,
    pageSize,
    fetchCertificates,
    getCertificateById,
    getCertificatesByDomain,
    refreshCertificate,
  }
})
