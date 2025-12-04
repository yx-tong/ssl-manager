import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'api-shared'
import { ElMessage } from 'element-plus'

export const useUsersStore = defineStore('adminUsers', () => {
    const users = ref<User[]>([])
    const loading = ref(false)
    const total = ref(0)
    const currentPage = ref(1)
    const pageSize = ref(10)

    const fetchUsers = async (page = 1, limit = 10) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            const mockUsers: User[] = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@example.com',
                    role: 'admin',
                    status: 'active',
                    created_at: new Date('2024-01-01').toISOString(),
                    last_login: new Date('2024-01-01').toISOString(),
                },
                {
                    id: 2,
                    username: 'user',
                    email: 'user@example.com',
                    role: 'user',
                    status: 'active',
                    created_at: new Date('2024-01-15').toISOString(),
                    last_login: new Date('2024-01-15').toISOString(),
                },
            ]

            users.value = mockUsers
            total.value = mockUsers.length
            currentPage.value = page
            pageSize.value = limit
        } catch (error) {
            ElMessage.error('Failed to fetch users')
            throw error
        } finally {
            loading.value = false
        }
    }

    const addUser = async (userData: Partial<User>) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const newUser: User = {
                id: Date.now(),
                username: userData.username || '',
                email: userData.email || '',
                role: userData.role || 'user',
                status: 'active',
                created_at: new Date().toISOString(),
                last_login: undefined,
            }

            users.value.unshift(newUser)
            total.value++
            ElMessage.success('User added successfully')
        } catch (error) {
            ElMessage.error('Failed to add user')
            throw error
        } finally {
            loading.value = false
        }
    }

    const updateUser = async (user: User) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const index = users.value.findIndex(u => u.id === user.id)
            if (index > -1) {
                users.value[index] = { ...user }
            }
            ElMessage.success('User updated successfully')
        } catch (error) {
            ElMessage.error('Failed to update user')
            throw error
        } finally {
            loading.value = false
        }
    }

    const removeUser = async (userId: number) => {
        loading.value = true

        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500))

            const index = users.value.findIndex(u => u.id === userId)
            if (index > -1) {
                users.value.splice(index, 1)
                total.value--
            }
            ElMessage.success('User deleted successfully')
        } catch (error) {
            ElMessage.error('Failed to delete user')
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        users,
        loading,
        total,
        currentPage,
        pageSize,
        fetchUsers,
        addUser,
        updateUser,
        removeUser,
    }
})
