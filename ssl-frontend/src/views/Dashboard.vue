<template>
  <div class="dashboard">
    <div class="container">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔒</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ certificates.length }}</h3>
            <p class="stat-label">Active Certificates</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🌐</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ domains.length }}</h3>
            <p class="stat-label">Managed Domains</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ expiringSoonCount }}</h3>
            <p class="stat-label">Expiring Soon</p>
          </div>
        </div>
      </div>
      
      <div class="recent-section">
        <h2 class="section-title">Recent Certificates</h2>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Issuer</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cert in recentCertificates" :key="cert.id">
                <td>{{ cert.domain }}</td>
                <td>{{ cert.issuer }}</td>
                <td>{{ cert.expiryDate }}</td>
                <td>
                  <span :class="['status-badge', cert.status]">
                    {{ cert.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
  sslStore.fetchDomains()
})

const certificates = computed(() => sslStore.certificates)
const domains = computed(() => sslStore.domains)

const recentCertificates = computed(() => {
  return certificates.value.slice(0, 5)
})

const expiringSoonCount = computed(() => {
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return certificates.value.filter(cert => {
    const expiryDate = new Date(cert.expiryDate)
    return expiryDate <= thirtyDaysFromNow && cert.status === 'active'
  }).length
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 2rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.stat-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.stat-label {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

.recent-section {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.table-container {
  overflow-x: auto;
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
</style>