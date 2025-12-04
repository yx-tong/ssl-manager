<template>
    <div class="admin-settings">
        <el-card>
            <template #header>
                <span>System Settings</span>
            </template>

            <el-tabs v-model="activeTab">
                <el-tab-pane label="General" name="general">
                    <el-form :model="generalSettings" label-width="200px">
                        <el-form-item label="Site Name">
                            <el-input v-model="generalSettings.siteName" />
                        </el-form-item>
                        <el-form-item label="Site Description">
                            <el-input
                                v-model="generalSettings.siteDescription"
                                type="textarea"
                                :rows="3"
                            />
                        </el-form-item>
                        <el-form-item label="Timezone">
                            <el-select
                                v-model="generalSettings.timezone"
                                placeholder="Select timezone"
                            >
                                <el-option label="UTC" value="UTC" />
                                <el-option label="EST" value="EST" />
                                <el-option label="PST" value="PST" />
                                <el-option label="CST" value="CST" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Maintenance Mode">
                            <el-switch v-model="generalSettings.maintenanceMode" />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="saveGeneralSettings"
                                :loading="saving"
                            >
                                Save Changes
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="SSL Monitoring" name="ssl">
                    <el-form :model="sslSettings" label-width="200px">
                        <el-form-item label="Check Interval (hours)">
                            <el-input-number
                                v-model="sslSettings.checkInterval"
                                :min="1"
                                :max="168"
                            />
                        </el-form-item>
                        <el-form-item label="Notification Days Before">
                            <el-input-number
                                v-model="sslSettings.notificationDays"
                                :min="1"
                                :max="90"
                            />
                        </el-form-item>
                        <el-form-item label="Enable Email Notifications">
                            <el-switch v-model="sslSettings.emailNotifications" />
                        </el-form-item>
                        <el-form-item label="Enable Webhook Notifications">
                            <el-switch v-model="sslSettings.webhookNotifications" />
                        </el-form-item>
                        <el-form-item label="Webhook URL" v-if="sslSettings.webhookNotifications">
                            <el-input
                                v-model="sslSettings.webhookUrl"
                                placeholder="https://your-webhook-url.com"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveSSLSettings" :loading="saving">
                                Save Changes
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="Email" name="email">
                    <el-form :model="emailSettings" label-width="200px">
                        <el-form-item label="SMTP Server">
                            <el-input v-model="emailSettings.smtpServer" />
                        </el-form-item>
                        <el-form-item label="SMTP Port">
                            <el-input-number
                                v-model="emailSettings.smtpPort"
                                :min="1"
                                :max="65535"
                            />
                        </el-form-item>
                        <el-form-item label="SMTP Username">
                            <el-input v-model="emailSettings.smtpUsername" />
                        </el-form-item>
                        <el-form-item label="SMTP Password">
                            <el-input
                                v-model="emailSettings.smtpPassword"
                                type="password"
                                show-password
                            />
                        </el-form-item>
                        <el-form-item label="Use SSL/TLS">
                            <el-switch v-model="emailSettings.useSSL" />
                        </el-form-item>
                        <el-form-item label="From Email">
                            <el-input v-model="emailSettings.fromEmail" type="email" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="testEmailSettings" :loading="testing">
                                Test Connection
                            </el-button>
                            <el-button type="primary" @click="saveEmailSettings" :loading="saving">
                                Save Changes
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="Security" name="security">
                    <el-form :model="securitySettings" label-width="200px">
                        <el-form-item label="Enable 2FA">
                            <el-switch v-model="securitySettings.enable2FA" />
                        </el-form-item>
                        <el-form-item label="Session Timeout (minutes)">
                            <el-input-number
                                v-model="securitySettings.sessionTimeout"
                                :min="5"
                                :max="1440"
                            />
                        </el-form-item>
                        <el-form-item label="Max Login Attempts">
                            <el-input-number
                                v-model="securitySettings.maxLoginAttempts"
                                :min="3"
                                :max="10"
                            />
                        </el-form-item>
                        <el-form-item label="Lockout Duration (minutes)">
                            <el-input-number
                                v-model="securitySettings.lockoutDuration"
                                :min="5"
                                :max="1440"
                            />
                        </el-form-item>
                        <el-form-item label="Require Strong Password">
                            <el-switch v-model="securitySettings.strongPassword" />
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="saveSecuritySettings"
                                :loading="saving"
                            >
                                Save Changes
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('general')
const saving = ref(false)
const testing = ref(false)

const generalSettings = reactive({
    siteName: 'SSL Manager Admin',
    siteDescription: 'SSL Certificate Management System',
    timezone: 'UTC',
    maintenanceMode: false,
})

const sslSettings = reactive({
    checkInterval: 24,
    notificationDays: 30,
    emailNotifications: true,
    webhookNotifications: false,
    webhookUrl: '',
})

const emailSettings = reactive({
    smtpServer: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    useSSL: true,
    fromEmail: '',
})

const securitySettings = reactive({
    enable2FA: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    strongPassword: true,
})

const saveGeneralSettings = async () => {
    saving.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('General settings saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save general settings')
    } finally {
        saving.value = false
    }
}

const saveSSLSettings = async () => {
    saving.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('SSL settings saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save SSL settings')
    } finally {
        saving.value = false
    }
}

const saveEmailSettings = async () => {
    saving.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('Email settings saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save email settings')
    } finally {
        saving.value = false
    }
}

const testEmailSettings = async () => {
    testing.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        ElMessage.success('Email connection test successful')
    } catch (error) {
        ElMessage.error('Email connection test failed')
    } finally {
        testing.value = false
    }
}

const saveSecuritySettings = async () => {
    saving.value = true
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('Security settings saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save security settings')
    } finally {
        saving.value = false
    }
}
</script>

<style lang="scss" scoped>
.admin-settings {
    padding: 20px;
}
</style>
