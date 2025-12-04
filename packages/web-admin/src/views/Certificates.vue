<template>
    <div class="admin-certificates">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>SSL Certificates</span>
                    <el-button type="primary" @click="refreshAll">
                        <el-icon><Refresh /></el-icon>
                        Refresh All
                    </el-button>
                </div>
            </template>

            <el-table
                :data="certificatesStore.certificates"
                style="width: 100%"
                v-loading="certificatesStore.loading"
            >
                <el-table-column prop="domain_id" label="Domain ID" />
                <el-table-column prop="certificate" label="Certificate" />
                <el-table-column prop="status" label="Status" />
                <el-table-column label="Issued">
                    <template #default="{ row }">
                        {{ formatDate(row.issued_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="Expires">
                    <template #default="{ row }">
                        <span :class="getExpiryClass(row.expires_at)">
                            {{ formatDate(row.expires_at) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="Days Left">
                    <template #default="{ row }">
                        <el-tag :type="getExpiryType(row.expires_at)">
                            {{ getDaysLeft(row.expires_at) }} days
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="150">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="viewDetails(row)">
                            <el-icon><View /></el-icon>
                            View
                        </el-button>
                        <el-button type="warning" size="small" @click="refreshCertificate(row)">
                            <el-icon><Refresh /></el-icon>
                            Refresh
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- Certificate Details Dialog -->
        <el-dialog v-model="showDetailsDialog" title="Certificate Details" width="700px">
            <div v-if="selectedCertificate" class="certificate-details">
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="Domain ID">
                        {{ selectedCertificate.domain_id }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Certificate">
                        {{ selectedCertificate.certificate }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Private Key">
                        {{ selectedCertificate.private_key }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Status">
                        <el-tag :type="getStatusType(selectedCertificate.status)">
                            {{ selectedCertificate.status }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="Issued">
                        {{ formatDate(selectedCertificate.issued_at) }}
                    </el-descriptions-item>
                    <el-descriptions-item label="Expires">
                        {{ formatDate(selectedCertificate.expires_at) }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCertificatesStore } from '@/stores/certificates'
import type { SSLCertificate } from '@/api/certificates'

const certificatesStore = useCertificatesStore()
const showDetailsDialog = ref(false)
const selectedCertificate = ref<SSLCertificate | null>(null)

const formatDate = (date?: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
}

const getDaysLeft = (date?: string) => {
    if (!date) return 0
    const now = new Date()
    const expiry = new Date(date)
    const diffTime = expiry.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const getExpiryClass = (date?: string) => {
    if (!date) return 'info'
    const daysLeft = getDaysLeft(date)
    if (daysLeft <= 7) return 'danger'
    if (daysLeft <= 30) return 'warning'
    return 'success'
}

const getExpiryType = (date?: string) => {
    if (!date) return 'info'
    const daysLeft = getDaysLeft(date)
    if (daysLeft <= 7) return 'danger'
    if (daysLeft <= 30) return 'warning'
    return 'success'
}

const getStatusType = (status: string) => {
    switch (status) {
        case 'active':
            return 'success'
        case 'expired':
            return 'danger'
        case 'warning':
            return 'warning'
        default:
            return 'info'
    }
}

const viewDetails = (certificate: SSLCertificate) => {
    selectedCertificate.value = certificate
    showDetailsDialog.value = true
}

const refreshCertificate = async (certificate: SSLCertificate) => {
    try {
        await certificatesStore.refreshCertificate(certificate.id)
    } catch (error) {
        console.error('Failed to refresh certificate:', error)
    }
}

const refreshAll = async () => {
    try {
        await certificatesStore.fetchCertificates()
    } catch (error) {
        console.error('Failed to refresh certificates:', error)
    }
}

onMounted(() => {
    certificatesStore.fetchCertificates()
})
</script>

<style lang="scss" scoped>
.admin-certificates {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.certificate-details {
    padding: 10px 0;
}

.text-success {
    color: var(--el-color-success);
}

.text-warning {
    color: var(--el-color-warning);
}

.text-danger {
    color: var(--el-color-danger);
}
</style>
