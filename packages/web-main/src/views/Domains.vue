<template>
    <div class="domains">
        <div class="container">
            <div class="header">
                <h1>Domains</h1>
                <button class="btn btn-primary" @click="showAddDomain = true">Add Domain</button>
            </div>

            <div v-if="domainsStore.loading" class="loading">
                <div class="spinner"></div>
                Loading domains...
            </div>

            <div v-else-if="domainsStore.error" class="error">
                {{ domainsStore.error }}
            </div>

            <div v-else>
                <div class="grid grid-cols-2">
                    <div class="card" v-for="domain in domainsStore.domains" :key="domain.id">
                        <div class="domain-header">
                            <h3>
                                <router-link :to="`/domain/${domain.id}`">
                                    {{ domain.name }}
                                </router-link>
                            </h3>
                            <div class="domain-actions">
                                <button
                                    class="btn btn-secondary btn-sm"
                                    @click="editDomain(domain)"
                                >
                                    Edit
                                </button>
                                <button class="btn btn-danger btn-sm" @click="deleteDomain(domain)">
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div class="domain-info">
                            <p>Last checked: {{ formatDate(domain.lastChecked) }}</p>
                            <div class="domain-settings">
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="domain.autoRenew"
                                        @change="updateDomain(domain)"
                                    />
                                    Auto-renew
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="domain.notificationEnabled"
                                        @change="updateDomain(domain)"
                                    />
                                    Notifications
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="domainsStore.domains.length === 0" class="empty-state">
                    No domains found. Add your first domain to get started.
                </div>
            </div>
        </div>

        <!-- Add Domain Modal -->
        <div v-if="showAddDomain" class="modal-overlay" @click="showAddDomain = false">
            <div class="modal" @click.stop>
                <h3>Add New Domain</h3>
                <form @submit.prevent="addDomain">
                    <div class="form-group">
                        <label for="domainName">Domain Name</label>
                        <input
                            id="domainName"
                            v-model="newDomainName"
                            type="text"
                            placeholder="example.com"
                            required
                        />
                    </div>
                    <div class="modal-actions">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="showAddDomain = false"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            :disabled="domainsStore.loading"
                        >
                            Add Domain
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDomainsStore } from '@/stores/domains'
import type { Domain } from 'api-shared'

const domainsStore = useDomainsStore()
const showAddDomain = ref(false)
const newDomainName = ref('')

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
}

const addDomain = async () => {
    if (!newDomainName.value.trim()) return

    try {
        await domainsStore.addDomain(newDomainName.value.trim())
        showAddDomain.value = false
        newDomainName.value = ''
    } catch (error) {
        console.error('Failed to add domain:', error)
    }
}

const editDomain = (domain: Domain) => {
    // TODO: Implement edit functionality
    console.log('Edit domain:', domain)
}

const deleteDomain = async (domain: Domain) => {
    if (confirm(`Are you sure you want to delete ${domain.name}?`)) {
        try {
            await domainsStore.removeDomain(domain.id)
        } catch (error) {
            console.error('Failed to delete domain:', error)
        }
    }
}

const updateDomain = (domain: Domain) => {
    // TODO: Implement update functionality
    console.log('Update domain:', domain)
}

onMounted(() => {
    domainsStore.fetchDomains()
})
</script>

<style lang="scss" scoped>
.domains {
    padding: 2rem 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.domain-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
        margin: 0;

        a {
            color: var(--color-text);
            text-decoration: none;

            &:hover {
                color: var(--color-primary);
            }
        }
    }
}

.domain-actions {
    display: flex;
    gap: 0.5rem;
}

.domain-settings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
    }
}

.loading,
.error,
.empty-state {
    text-align: center;
    padding: 2rem;
}

.error {
    color: var(--color-danger);
}

.empty-state {
    color: var(--color-text-secondary);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: var(--color-surface);
    border-radius: $border-radius-lg;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: $shadow-lg;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}
</style>
