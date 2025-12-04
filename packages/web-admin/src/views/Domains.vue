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

      <el-table :data="domainsStore.domains" style="width: 100%" v-loading="domainsStore.loading">
        <el-table-column prop="domain" label="Domain Name" />
        <el-table-column prop="lastChecked" label="Last Checked">
          <template #default="{ row }">
            {{ formatDate(row.lastChecked) }}
          </template>
        </el-table-column>
        <el-table-column label="Auto Renew">
          <template #default="{ row }">
            <el-switch v-model="row.autoRenew" @change="handleAutoRenewChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="Notifications">
          <template #default="{ row }">
            <el-switch v-model="row.notificationEnabled" @change="handleNotificationChange(row)" />
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
          <el-input v-model="newDomain.name" placeholder="example.com" />
        </el-form-item>
        <el-form-item label="Auto Renew">
          <el-switch v-model="newDomain.autoRenew" />
        </el-form-item>
        <el-form-item label="Notifications">
          <el-switch v-model="newDomain.notificationEnabled" />
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
          <el-input v-model="editingDomain.name" disabled />
        </el-form-item>
        <el-form-item label="Auto Renew">
          <el-switch v-model="editingDomain.autoRenew" />
        </el-form-item>
        <el-form-item label="Notifications">
          <el-switch v-model="editingDomain.notificationEnabled" />
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
    name: '',
    autoRenew: true,
    notificationEnabled: true,
  })

  const editingDomain = ref<Domain>({
    id: '',
    domain: '',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const handlePageChange = (page: number) => {
    domainsStore.fetchDomains(page, domainsStore.pageSize)
  }

  const handleAddDomain = async () => {
    if (!newDomain.value.name.trim()) {
      return
    }

    try {
      await domainsStore.addDomain(newDomain.value.name.trim())
      showAddDialog.value = false
      newDomain.value.name = ''
    } catch (error) {
      console.error('Failed to add domain:', error)
    }
  }

  const handleEditDomain = async () => {
    try {
      await domainsStore.updateDomain(editingDomain.value)
      showEditDialog.value = false
    } catch (error) {
      console.error('Failed to update domain:', error)
    }
  }

  const handleAutoRenewChange = (domain: Domain) => {
    domainsStore.updateDomain(domain)
  }

  const handleNotificationChange = (domain: Domain) => {
    domainsStore.updateDomain(domain)
  }

  const editDomain = (domain: Domain) => {
    editingDomain.value = { ...domain }
    showEditDialog.value = true
  }

  const deleteDomain = async (domain: Domain) => {
    try {
      await ElMessageBox.confirm(
        `Are you sure you want to delete ${domain.name}?`,
        'Delete Domain',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )

      await domainsStore.removeDomain(Number(domain.id))
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
