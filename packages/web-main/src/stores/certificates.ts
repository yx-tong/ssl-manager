import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SSLCertificate } from 'api-shared'

export const useCertificatesStore = defineStore('certificates', () => {
    const certificates = ref<SSLCertificate[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchCertificates = async () => {
        loading.value = true
        error.value = null

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            certificates.value = [
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
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch certificates'
        } finally {
            loading.value = false
        }
    }

    const getCertificateById = (id: string) => {
        return certificates.value.find(cert => cert.id === id)
    }

    const getCertificatesByDomain = (domain: string) => {
        return certificates.value.filter(cert => cert.domain === domain)
    }

    return {
        certificates,
        loading,
        error,
        fetchCertificates,
        getCertificateById,
        getCertificatesByDomain,
    }
})
