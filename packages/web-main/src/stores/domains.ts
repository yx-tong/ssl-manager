import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Domain } from 'api-shared'

export const useDomainsStore = defineStore('domains', () => {
    const domains = ref<Domain[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchDomains = async () => {
        loading.value = true
        error.value = null

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            domains.value = [
                {
                    id: 1,
                    domain: 'example.com',
                    name: 'example.com',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    lastChecked: new Date(),
                    autoRenew: true,
                    notificationEnabled: true,
                },
                {
                    id: 2,
                    domain: 'test.com',
                    name: 'test.com',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    lastChecked: new Date(),
                    autoRenew: false,
                    notificationEnabled: true,
                },
            ]
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch domains'
        } finally {
            loading.value = false
        }
    }

    const addDomain = async (domainName: string) => {
        loading.value = true
        error.value = null

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const newDomain: Domain = {
                id: Date.now(),
                domain: domainName,
                name: domainName,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                lastChecked: new Date(),
                autoRenew: true,
                notificationEnabled: true,
            }

            domains.value.push(newDomain)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to add domain'
            throw err
        } finally {
            loading.value = false
        }
    }

    const removeDomain = async (domainId: string | number) => {
        loading.value = true
        error.value = null

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const index = domains.value.findIndex(d => d.id === domainId)
            if (index > -1) {
                domains.value.splice(index, 1)
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to remove domain'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        domains,
        loading,
        error,
        fetchDomains,
        addDomain,
        removeDomain,
    }
})
