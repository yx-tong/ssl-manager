<template>
  <div class="admin-users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Users Management</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            Add User
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="usersStore.users"
        style="width: 100%"
        v-loading="usersStore.loading"
      >
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role" />
        <el-table-column label="Status">
          <template #default="{ row }">
            <el-tag :type="row.active ? 'success' : 'danger'">
              {{ row.active ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Created At">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Last Login">
          <template #default="{ row }">
            {{ row.lastLogin ? formatDate(row.lastLogin) : 'Never' }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editUser(row)">
              <el-icon><Edit /></el-icon>
              Edit
            </el-button>
            <el-button 
              :type="row.active ? 'warning' : 'success'" 
              size="small" 
              @click="toggleUserStatus(row)"
            >
              <el-icon><Switch /></el-icon>
              {{ row.active ? 'Disable' : 'Enable' }}
            </el-button>
            <el-button type="danger" size="small" @click="deleteUser(row)">
              <el-icon><Delete /></el-icon>
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Add User Dialog -->
    <el-dialog
      v-model="showAddDialog"
      title="Add New User"
      width="500px"
    >
      <el-form :model="newUser" label-width="120px" ref="addUserForm">
        <el-form-item label="Username" prop="username">
          <el-input
            v-model="newUser.username"
            placeholder="Enter username"
          />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="newUser.email"
            placeholder="Enter email"
            type="email"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="newUser.password"
            placeholder="Enter password"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="newUser.role" placeholder="Select role">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleAddUser" :loading="usersStore.loading">
          Add User
        </el-button>
      </template>
    </el-dialog>
    
    <!-- Edit User Dialog -->
    <el-dialog
      v-model="showEditDialog"
      title="Edit User"
      width="500px"
    >
      <el-form :model="editingUser" label-width="120px" ref="editUserForm">
        <el-form-item label="Username">
          <el-input v-model="editingUser.username" disabled />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="editingUser.email"
            placeholder="Enter email"
            type="email"
          />
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="editingUser.role" placeholder="Select role">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="New Password">
          <el-input
            v-model="editingUser.password"
            placeholder="Enter new password (optional)"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditUser" :loading="usersStore.loading">
          Save Changes
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/api/users'

const usersStore = useUsersStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)

const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

const editingUser = ref<User & { password?: string }>({
  id: 0,
  username: '',
  email: '',
  role: 'user',
  status: 'active',
  created_at: new Date().toISOString(),
  last_login: undefined,
  password: ''
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const handleAddUser = async () => {
  if (!newUser.value.username.trim() || !newUser.value.email.trim() || !newUser.value.password.trim()) {
    return
  }
  
  try {
    await usersStore.addUser({
      username: newUser.value.username.trim(),
      email: newUser.value.email.trim(),
      password: newUser.value.password.trim(),
      role: newUser.value.role
    })
    showAddDialog.value = false
    newUser.value = { username: '', email: '', password: '', role: 'user' }
  } catch (error) {
    console.error('Failed to add user:', error)
  }
}

const handleEditUser = async () => {
  try {
    await usersStore.updateUser({
      ...editingUser.value,
      password: editingUser.value.password || undefined
    })
    showEditDialog.value = false
    editingUser.value.password = ''
  } catch (error) {
    console.error('Failed to update user:', error)
  }
}

const editUser = (user: User) => {
  editingUser.value = { ...user, password: '' }
  showEditDialog.value = true
}

const toggleUserStatus = async (user: User) => {
  try {
    await usersStore.updateUser({
      ...user,
      active: !user.active
    })
  } catch (error) {
    console.error('Failed to toggle user status:', error)
  }
}

const deleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${user.username}?`,
      'Delete User',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await usersStore.removeUser(user.id)
  } catch (error) {
    // User cancelled or error occurred
  }
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<style lang="scss" scoped>
.admin-users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>