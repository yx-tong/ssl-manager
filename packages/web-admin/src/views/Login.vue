<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1>SSL Manager Admin</h1>
                <p>Administrator Login</p>
            </div>

            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                class="login-form"
                @submit.prevent="handleLogin"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="Username"
                        prefix-icon="User"
                        size="large"
                    />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="Password"
                        prefix-icon="Lock"
                        size="large"
                        show-password
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        :loading="loading"
                        class="login-button"
                        native-type="submit"
                    >
                        Login
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { authAPI } from '@/api/auth'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
    username: '',
    password: '',
})

const loginRules: FormRules = {
    username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
    password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
}

const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate(async valid => {
        if (valid) {
            loading.value = true
            try {
                const response = await authAPI.login({
                    username: loginForm.username,
                    password: loginForm.password,
                })

                localStorage.setItem('admin-token', response.data.token)
                localStorage.setItem('admin-username', response.data.user.username)
                ElMessage.success('Login successful')
                router.push('/dashboard')
            } catch (error) {
                ElMessage.error('Invalid username or password')
            } finally {
                loading.value = false
            }
        }
    })
}
</script>

<style scoped lang="scss">
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.login-box {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 400px;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
        color: var(--color-primary);
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 8px 0;
    }

    p {
        color: var(--color-text-secondary);
        font-size: 14px;
        margin: 0;
    }
}

.login-form {
    .el-form-item {
        margin-bottom: 20px;
    }
}

.login-button {
    width: 100%;
    font-size: 16px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .login-box {
        padding: 30px 20px;
    }
}
</style>
