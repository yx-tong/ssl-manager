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
                    id: 1,
                    domain_id: 1,
                    certificate:
                        '-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQCKOGJQlJdZVTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV\nUzAeFw0yNDAxMDEwMDAwMDBaFw0yNDEyMzEyMzU5NTlaMA0xCzAJBgNVBAYTAlVT\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
                    private_key:
                        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...',
                    status: 'valid',
                    issued_at: new Date('2024-01-01').toISOString(),
                    expires_at: new Date('2024-12-31').toISOString(),
                    created_at: new Date('2024-01-01').toISOString(),
                    updated_at: new Date('2024-01-01').toISOString(),
                },
                {
                    id: 2,
                    domain_id: 2,
                    certificate:
                        '-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQCKOGJQlJdZVTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV\nUzAeFw0yNDA2MDEwMDAwMDBaFw0yNTA2MDEyMzU5NTlaMA0xCzAJBgNVBAYTAlVT\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
                    private_key:
                        '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...',
                    status: 'valid',
                    issued_at: new Date('2024-06-01').toISOString(),
                    expires_at: new Date('2025-06-01').toISOString(),
                    created_at: new Date('2024-06-01').toISOString(),
                    updated_at: new Date('2024-06-01').toISOString(),
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
        return certificates.value.find((cert: SSLCertificate) => cert.id === id)
    }

    const getCertificatesByDomain = (domainId: number) => {
        return certificates.value.filter((cert: SSLCertificate) => cert.domain_id === domainId)
    }

    const refreshCertificate = async (certificateId: number) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(`Certificate ${certificateId} refreshed successfully`)
        } catch (error) {
            console.error('Failed to refresh certificate:', error)
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
