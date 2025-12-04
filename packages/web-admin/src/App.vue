<template>
  <div class="app-container">
    <el-container v-if="!isLoginPage" class="admin-layout">
      <el-aside width="200px" class="admin-sidebar">
        <div class="logo">
          <h2>SSL Admin</h2>
        </div>
        <el-menu
          :default-active="$route.path"
          class="admin-menu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Monitor /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/domains">
            <el-icon><Globe /></el-icon>
            <span>Domains</span>
          </el-menu-item>
          <el-menu-item index="/certificates">
            <el-icon><Key /></el-icon>
            <span>Certificates</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>Users</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="admin-header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
              <el-breadcrumb-item>{{ $route.meta.title || 'Dashboard' }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-dropdown">
                {{ username }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Profile</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'

  const router = useRouter()
  const username = ref('Admin User')

  const isLoginPage = computed(() => router.currentRoute.value.path === '/login')

  onMounted(() => {
    const savedUsername = localStorage.getItem('admin-username')
    if (savedUsername) {
      username.value = savedUsername
    }
  })

  const handleLogout = () => {
    ElMessageBox.confirm('Are you sure you want to logout?', 'Logout', {
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }).then(() => {
      localStorage.removeItem('admin-token')
      localStorage.removeItem('admin-username')
      router.push('/login')
    })
  }
</script>

<style lang="scss" scoped>
  .app-container {
    height: 100vh;
  }

  .admin-layout {
    height: 100vh;
  }

  .admin-sidebar {
    background-color: #304156;

    .logo {
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid #434a50;

      h2 {
        color: #ffffff;
        margin: 0;
        font-size: 1.25rem;
      }
    }

    .admin-menu {
      border-right: none;
    }
  }

  .admin-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;

    .header-left {
      flex: 1;
    }

    .header-right {
      .user-dropdown {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }

  .admin-main {
    background-color: #f5f7fa;
    padding: 1.5rem;
  }
</style>
