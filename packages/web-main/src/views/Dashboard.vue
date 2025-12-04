<template>
  <div class="dashboard">
    <div class="container">
      <h1>Dashboard</h1>
      
      <div class="grid grid-cols-3">
        <div class="card">
          <h3>Total Domains</h3>
          <div class="metric">{{ domainsStore.domains.length }}</div>
        </div>
        
        <div class="card">
          <h3>Valid Certificates</h3>
          <div class="metric valid">
            {{ validCertificates.length }}
          </div>
        </div>
        
        <div class="card">
          <h3>Expiring Soon</h3>
          <div class="metric expiring">
            {{ expiringCertificates.length }}
          </div>
        </div>
      </div>
      
      <div class="card">
        <h3>Recent Certificates</h3>
        <div v-if="certificatesStore.loading" class="loading">
          <div class="spinner"></div>
          Loading certificates...
        </div>
        
        <div v-else-if="certificatesStore.error" class="error">
          {{ certificatesStore.error }}
        </div>
        
        <div v-else>
          <table class="table" v-if="certificatesStore.certificates.length > 0">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Status</th>
                <th>Valid To</th>
                <th>Days Left</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cert in recentCertificates" :key="cert.id">
                <td>{{ cert.domain }}</td>
                <td>
                  <span :class="['status-badge', cert.status]">
                    {{ cert.status }}
                  </span>
                </td>
                <td>{{ formatDate(cert.validTo) }}</td>
                <td>{{ cert.daysUntilExpiry }}</td>
              </tr>
            </tbody>
          </table>
          
          <div v-else class="empty-state">
            No certificates found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDomainsStore } from '@/stores/domains'
import { useCertificatesStore } from '@/stores/certificates'

const domainsStore = useDomainsStore()
const certificatesStore = useCertificatesStore()

const validCertificates = computed(() => 
  certificatesStore.certificates.filter(cert => cert.status === 'valid')
)

const expiringCertificates = computed(() => 
  certificatesStore.certificates.filter(cert => cert.status === 'expiring')
)

const recentCertificates = computed(() => 
  certificatesStore.certificates.slice(0, 5)
)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  domainsStore.fetchDomains()
  certificatesStore.fetchCertificates()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 2rem 0;
}

.metric {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
  
  &.valid {
    color: var(--color-valid);
  }
  
  &.expiring {
    color: var(--color-expiring);
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
</style>