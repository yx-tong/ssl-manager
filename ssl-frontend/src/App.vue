<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">SSL Certificate Manager</h1>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Dashboard</router-link>
          <router-link to="/certificates" class="nav-link">Certificates</router-link>
          <router-link to="/domains" class="nav-link">Domains</router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App component setup
</script>

<style scoped lang="scss">
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover,
    &.router-link-active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.main-content {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
}
</style>