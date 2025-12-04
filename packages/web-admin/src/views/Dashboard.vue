<template>
    <div class="admin-dashboard">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon domains">
                            <el-icon size="32"><Globe /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number">{{ domainsStore.total }}</div>
                            <div class="stat-label">Total Domains</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon certificates">
                            <el-icon size="32"><Key /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number">{{ certificatesStore.total }}</div>
                            <div class="stat-label">Total Certificates</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon users">
                            <el-icon size="32"><User /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number">{{ usersStore.total }}</div>
                            <div class="stat-label">Total Users</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon expiring">
                            <el-icon size="32"><Warning /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number">{{ expiringCertificates }}</div>
                            <div class="stat-label">Expiring Soon</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mt-4">
            <el-col :span="12">
                <el-card title="Recent Certificates">
                    <el-table
                        :data="recentCertificates"
                        style="width: 100%"
                        v-loading="certificatesStore.loading"
                    >
                        <el-table-column prop="domain_id" label="Domain ID" />
                        <el-table-column prop="status" label="Status">
                            <template #default="{ row }">
                                <el-tag :type="getStatusType(row.status)" size="small">
                                    {{ row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="Expires">
                            <template #default="{ row }">
                                {{ formatDate(row.expires_at) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card title="Recent Domains">
                    <el-table
                        :data="recentDomains"
                        style="width: 100%"
                        v-loading="domainsStore.loading"
                    >
                        <el-table-column prop="domain" label="Domain" />
                        <el-table-column prop="status" label="Status" />
                        <el-table-column prop="created_at" label="Created">
                            <template #default="{ row }">
                                {{ formatDate(row.created_at) }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDomainsStore } from '@/stores/domains'
import { useCertificatesStore } from '@/stores/certificates'
import { useUsersStore } from '@/stores/users'
import type { SSLCertificate } from '@/api/certificates'

const domainsStore = useDomainsStore()
const certificatesStore = useCertificatesStore()
const usersStore = useUsersStore()

const expiringCertificates = computed(
    () =>
        certificatesStore.certificates.filter((cert: SSLCertificate) => {
            const daysLeft = Math.ceil(
                (new Date(cert.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )
            return daysLeft <= 30 && cert.status === 'active'
        }).length
)

const recentCertificates = computed(() => certificatesStore.certificates.slice(0, 5))

const recentDomains = computed(() => domainsStore.domains.slice(0, 5))

const getStatusType = (status: string) => {
    switch (status) {
        case 'valid':
            return 'success'
        case 'expiring':
            return 'warning'
        case 'expired':
            return 'danger'
        default:
            return 'info'
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

onMounted(() => {
    domainsStore.fetchDomains()
    certificatesStore.fetchCertificates()
    usersStore.fetchUsers()
})
</script>

<style lang="scss" scoped>
.admin-dashboard {
    padding: 20px;
}

.stat-card {
    margin-bottom: 20px;

    .stat-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        &.domains {
            background-color: #409eff;
        }

        &.certificates {
            background-color: #67c23a;
        }

        &.users {
            background-color: #e6a23c;
        }

        &.expiring {
            background-color: #f56c6c;
        }
    }

    .stat-info {
        text-align: right;
    }

    .stat-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 4px;
    }

    .stat-label {
        font-size: 14px;
        color: #909399;
    }
}
</style>
