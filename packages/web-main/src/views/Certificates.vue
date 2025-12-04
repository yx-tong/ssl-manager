<template>
  <div class="certificates">
    <div class="container">
      <h1>Certificates</h1>
      
      <div class="filters">
        <div class="form-group">
          <label for="statusFilter">Filter by Status</label>
          <select id="statusFilter" v-model="statusFilter">
            <option value="">All</option>
            <option value="valid">Valid</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="searchFilter">Search</label>
          <input
            id="searchFilter"
            v-model="searchFilter"
            type="text"
            placeholder="Search by domain..."
          >
        </div>
      </div>
      
      <div v-if="certificatesStore.loading" class="loading">
        <div class="spinner"></div>
        Loading certificates...
      </div>
      
      <div v-else-if="certificatesStore.error" class="error">
        {{ certificatesStore.error }}
      </div>
      
      <div v-else>
        <div class="card">
          <table class="table" v-if="filteredCertificates.length > 0">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Status</th>
                <th>Issuer</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Days Left</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cert in filteredCertificates" :key="cert.id">
                <td>{{ cert.domain }}</td>
                <td>
                  <span :class="['status-badge', cert.status]">
                    {{ cert.status }}
                  </span>
                </td>
                <td>{{ cert.issuer }}</td>
                <td>{{ formatDate(cert.validFrom) }}</td>
                <td>{{ formatDate(cert.validTo) }}</td>
                <td>
                  <span :class="{ 'text-danger': cert.daysUntilExpiry <= 30 }">
                    {{ cert.daysUntilExpiry }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="viewCertificate(cert)">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-else class="empty-state">
            No certificates found matching your criteria.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCertificatesStore } from '@/stores/certificates'
import type { SSLCertificate } from 'api-shared'

const certificatesStore = useCertificatesStore()
const statusFilter = ref('')
const searchFilter = ref('')

const filteredCertificates = computed(() => {
  let certificates = certificatesStore.certificates
  
  if (statusFilter.value) {
    certificates = certificates.filter(cert => cert.status === statusFilter.value)
  }
  
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase()
    certificates = certificates.filter(cert => 
      cert.domain.toLowerCase().includes(search)
    )
  }
  
  return certificates
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const viewCertificate = (certificate: SSLCertificate) => {
  // TODO: Implement certificate detail view
  console.log('View certificate:', certificate)
}

onMounted(() => {
  certificatesStore.fetchCertificates()
})
</script>

<style lang="scss" scoped>
.certificates {
  padding: 2rem 0;
}

.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  .form-group {
    margin-bottom: 0;
    min-width: 200px;
  }
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
}

.error {
  color: var(--color-danger);
}

.empty-state {
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