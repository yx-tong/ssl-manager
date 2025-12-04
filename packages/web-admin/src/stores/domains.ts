import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Domain } from '@/api/domains'
import { ElMessage } from 'element-plus'

export const useDomainsStore = defineStore('adminDomains', () => {
    const domains = ref<Domain[]>([])
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    const fetchDomains = async (page = 1, limit = 10) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockDomains: Domain[] = [
                {
                    id: 1,
                    domain: 'example.com',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    domain: 'test.com',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]

            domains.value = mockDomains
            total.value = mockDomains.length
            currentPage.value = page
            pageSize.value = limit
        } catch (error) {
            ElMessage.error('Failed to fetch domains')
            throw error
        } finally {
            loading.value = false
        }
    }

    const addDomain = async (domainName: string) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const newDomain: Domain = {
                id: Date.now(),
                domain: domainName,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            domains.value.unshift(newDomain)
            total.value++
            ElMessage.success('Domain added successfully')
        } catch (error) {
            ElMessage.error('Failed to add domain')
            throw error
        } finally {
            loading.value = false
        }
    }

    const updateDomain = async (domain: Domain) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const index = domains.value.findIndex((d: Domain) => d.id === domain.id)
            if (index > -1) {
                domains.value[index] = domain
            }
            ElMessage.success('Domain updated successfully')
        } catch (error) {
            ElMessage.error('Failed to update domain')
            throw error
        } finally {
            loading.value = false
        }
    }

    const removeDomain = async (domainId: number) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const index = domains.value.findIndex((d: Domain) => d.id === domainId)
            if (index > -1) {
                domains.value.splice(index, 1)
                total.value--
            }
            ElMessage.success('Domain deleted successfully')
        } catch (error) {
            ElMessage.error('Failed to delete domain')
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        domains,
        loading,
        total,
        currentPage,
        pageSize,
        fetchDomains,
        addDomain,
        updateDomain,
        removeDomain,
    }
})
