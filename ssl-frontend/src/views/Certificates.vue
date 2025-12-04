<template>
  <div class="certificates">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Certificates</h1>
        <button class="btn-primary" @click="showAddModal = true">
          Add Certificate
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Issuer</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cert in certificates" :key="cert.id">
              <td>{{ cert.domain }}</td>
              <td>{{ cert.issuer }}</td>
              <td>{{ cert.expiryDate }}</td>
              <td>
                <span :class="['status-badge', cert.status]">
                  {{ cert.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-secondary" @click="viewCertificate(cert)">
                    View
                  </button>
                  <button class="btn-danger" @click="deleteCertificate(cert)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSSLStore } from '@/stores/ssl'

const sslStore = useSSLStore()

onMounted(() => {
  sslStore.fetchCertificates()
})

const certificates = computed(() => sslStore.certificates)

const showAddModal = ref(false)

const viewCertificate = (cert: any) => {
  console.log('View certificate:', cert)
}

const deleteCertificate = (cert: any) => {
  console.log('Delete certificate:', cert)
}
</script>

<style scoped lang="scss">
.certificates {
  padding: 2rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
  }

  tbody tr:hover {
    background-color: #f7fafc;
  }
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;

  &.active {
    background-color: #c6f6d5;
    color: #22543d;
  }

  &.expired {
    background-color: #fed7d7;
    color: #742a2a;
  }

  &.pending {
    background-color: #feebc8;
    color: #744210;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #cbd5e0;
  }
}

.btn-danger {
  background: #fed7d7;
  color: #742a2a;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #feb2b2;
  }
}
</style>