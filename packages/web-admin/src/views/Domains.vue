<template>
    <div class="admin-domains">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>Domains Management</span>
                    <el-button type="primary" @click="showAddDialog = true">
                        <el-icon><Plus /></el-icon>
                        Add Domain
                    </el-button>
                </div>
            </template>

            <el-table
                :data="domainsStore.domains"
                style="width: 100%"
                v-loading="domainsStore.loading"
            >
                <el-table-column prop="domain" label="Domain Name" />
                <el-table-column prop="status" label="Status" />
                <el-table-column prop="created_at" label="Created">
                    <template #default="{ row }">
                        {{ formatDate(row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="Last Updated">
                    <template #default="{ row }">
                        {{ formatDate(row.updated_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="200">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="editDomain(row)">
                            <el-icon><Edit /></el-icon>
                            Edit
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteDomain(row)">
                            <el-icon><Delete /></el-icon>
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination
                    v-model:current-page="domainsStore.currentPage"
                    v-model:page-size="domainsStore.pageSize"
                    :total="domainsStore.total"
                    @current-change="handlePageChange"
                    layout="total, prev, pager, next"
                />
            </div>
        </el-card>

        <!-- Add Domain Dialog -->
        <el-dialog v-model="showAddDialog" title="Add New Domain" width="500px">
            <el-form :model="newDomain" label-width="120px">
                <el-form-item label="Domain Name">
                    <el-input v-model="newDomain.domain" placeholder="example.com" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAddDialog = false">Cancel</el-button>
                <el-button type="primary" @click="handleAddDomain" :loading="domainsStore.loading">
                    Add Domain
                </el-button>
            </template>
        </el-dialog>

        <!-- Edit Domain Dialog -->
        <el-dialog v-model="showEditDialog" title="Edit Domain" width="500px">
            <el-form :model="editingDomain" label-width="120px">
                <el-form-item label="Domain Name">
                    <el-input v-model="editingDomain.domain" disabled />
                </el-form-item>
                <el-form-item label="Status">
                    <el-select v-model="editingDomain.status">
                        <el-option label="Active" value="active" />
                        <el-option label="Inactive" value="inactive" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditDialog = false">Cancel</el-button>
                <el-button type="primary" @click="handleEditDomain" :loading="domainsStore.loading">
                    Save Changes
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useDomainsStore } from '@/stores/domains'
import type { Domain } from '@/api/domains'

const domainsStore = useDomainsStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)

const newDomain = ref({
    domain: '',
})

const editingDomain = ref<Partial<Domain>>({
    id: 0,
    domain: '',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
})

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

const handlePageChange = (page: number) => {
    domainsStore.fetchDomains(page, domainsStore.pageSize)
}

const handleAddDomain = async () => {
    if (!newDomain.value.domain.trim()) {
        return
    }

    try {
        await domainsStore.addDomain(newDomain.value.domain.trim())
        showAddDialog.value = false
        newDomain.value.domain = ''
    } catch (error) {
        console.error('Failed to add domain:', error)
    }
}

const handleEditDomain = async () => {
    try {
        // Convert Partial<Domain> to Domain by ensuring all required fields are present
        const domainToUpdate: Domain = {
            id: editingDomain.value.id || 0,
            domain: editingDomain.value.domain || '',
            status: editingDomain.value.status || 'active',
            created_at: editingDomain.value.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        await domainsStore.updateDomain(domainToUpdate)
        showEditDialog.value = false
    } catch (error) {
        console.error('Failed to update domain:', error)
    }
}

const editDomain = (domain: Domain) => {
    editingDomain.value = { ...domain }
    showEditDialog.value = true
}

const deleteDomain = async (domain: Domain) => {
    try {
        await ElMessageBox.confirm(
            `Are you sure you want to delete ${domain.domain}?`,
            'Delete Domain',
            {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )

        await domainsStore.removeDomain(domain.id)
    } catch (error) {
        // User cancelled or error occurred
    }
}

onMounted(() => {
    domainsStore.fetchDomains()
})
</script>

<style lang="scss" scoped>
.admin-domains {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
