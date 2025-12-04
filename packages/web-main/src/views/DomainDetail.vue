<template>
    <div class="domain-detail">
        <div class="container">
            <div class="header">
                <h1>{{ (domain as any)?.name }}</h1>
                <div class="header-actions">
                    <button class="btn btn-primary" @click="refreshCertificates">Refresh</button>
                    <router-link to="/domains" class="btn btn-secondary">
                        Back to Domains
                    </router-link>
                </div>
            </div>

            <div v-if="!domain" class="loading">
                <div class="spinner"></div>
                Loading domain details...
            </div>

            <div v-else>
                <div class="grid grid-cols-2">
                    <div class="card">
                        <h3>Domain Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Domain:</strong>
                                <span>{{ (domain as any).name }}</span>
                            </div>
                            <div class="info-item">
                                <strong>Last Checked:</strong>
                                <span>{{ formatDate((domain as any).lastChecked) }}</span>
                            </div>
                            <div class="info-item">
                                <strong>Auto Renew:</strong>
                                <span :class="(domain as any).autoRenew ? 'text-success' : 'text-secondary'">
                                    {{ (domain as any).autoRenew ? 'Enabled' : 'Disabled' }}
                                </span>
                            </div>
                            <div class="info-item">
                                <strong>Notifications:</strong>
                                <span
                                    :class="
                                        (domain as any).notificationEnabled
                                            ? 'text-success'
                                            : 'text-secondary'
                                    "
                                >
                                    {{ (domain as any).notificationEnabled ? 'Enabled' : 'Disabled' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3>Certificate Summary</h3>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <div class="summary-value">{{ validCertificates.length }}</div>
                                <div class="summary-label">Valid</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value expiring">
                                    {{ expiringCertificates.length }}
                                </div>
                                <div class="summary-label">Expiring</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value expired">
                                    {{ expiredCertificates.length }}
                                </div>
                                <div class="summary-label">Expired</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3>Certificates</h3>
                    <div v-if="certificatesStore.loading" class="loading">
                        <div class="spinner"></div>
                        Loading certificates...
                    </div>

                    <div v-else-if="certificatesStore.error" class="error">
                        {{ certificatesStore.error }}
                    </div>

                    <div v-else>
                        <table class="table" v-if="domainCertificates.length > 0">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Issuer</th>
                                    <th>Valid From</th>
                                    <th>Valid To</th>
                                    <th>Days Left</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cert in domainCertificates" :key="cert.id">
                                    <td>{{ (cert as any).subject }}</td>
                                    <td>
                                        <span :class="['status-badge', (cert as any).status]">
                                            {{ (cert as any).status }}
                                        </span>
                                    </td>
                                    <td>{{ (cert as any).issuer }}</td>
                                    <td>{{ formatDate((cert as any).validFrom) }}</td>
                                    <td>{{ formatDate((cert as any).validTo) }}</td>
                                    <td>
                                        <span
                                            :class="{ 'text-danger': (cert as any).daysUntilExpiry <= 30 }"
                                            class="badge"
                                        >
                                            {{ (cert as any).daysUntilExpiry }}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            class="btn btn-primary btn-sm"
                                            @click="viewCertificate(cert)"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div v-else class="empty-state">No certificates found for this domain.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDomainsStore } from '@/stores/domains'
import { useCertificatesStore } from '@/stores/certificates'
import type { SSLCertificate } from 'api-shared'

const route = useRoute()
const domainsStore = useDomainsStore()
const certificatesStore = useCertificatesStore()

const domainId = ref(route.params.id as string)

const domain = computed(() => domainsStore.domains.find(d => d.id.toString() === domainId.value))

const domainCertificates = computed(() =>
    certificatesStore.getCertificatesByDomain(domain.value?.domain || '')
)

const validCertificates = computed(() =>
    domainCertificates.value.filter(cert => cert.status === 'valid' as any)
)

const expiringCertificates = computed(() =>
    domainCertificates.value.filter(cert => cert.status === 'expiring' as any)
)

const expiredCertificates = computed(() =>
    domainCertificates.value.filter(cert => cert.status === 'expired' as any)
)

const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
}

const refreshCertificates = () => {
    certificatesStore.fetchCertificates()
}

const viewCertificate = (certificate: SSLCertificate) => {
    // TODO: Implement certificate detail view
    console.log('View certificate:', certificate)
}

onMounted(() => {
    if (domainsStore.domains.length === 0) {
        domainsStore.fetchDomains()
    }
    certificatesStore.fetchCertificates()
})
</script>

<style lang="scss" scoped>
.domain-detail {
    padding: 2rem 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header-actions {
    display: flex;
    gap: 1rem;
}

.info-grid {
    display: grid;
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child {
        border-bottom: none;
    }

    strong {
        color: var(--color-text-secondary);
    }
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    text-align: center;
}

.summary-item {
    .summary-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;

        &.expiring {
            color: var(--color-expiring);
        }

        &.expired {
            color: var(--color-expired);
        }
    }

    .summary-label {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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

.text-success {
    color: var(--color-success);
}

.text-secondary {
    color: var(--color-text-secondary);
}

.text-danger {
    color: var(--color-danger);
    font-weight: 600;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}
</style>
