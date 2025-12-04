<template>
    <div id="app">
        <nav class="navbar">
            <div class="container">
                <router-link to="/" class="logo">
                    <h1>SSL Manager</h1>
                </router-link>
                <div class="nav-links">
                    <router-link to="/" class="nav-link">Dashboard</router-link>
                    <router-link to="/domains" class="nav-link">Domains</router-link>
                    <router-link to="/certificates" class="nav-link">Certificates</router-link>
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

<style lang="scss" scoped>
    .navbar {
        background: var(--color-primary);
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .logo {
            text-decoration: none;
            color: white;

            h1 {
                margin: 0;
                font-size: 1.5rem;
            }
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-link {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;

            &:hover,
            &.router-link-active {
                background-color: rgba(255, 255, 255, 0.2);
            }
        }
    }

    .main-content {
        min-height: calc(100vh - 80px);
        background-color: var(--color-background);
    }
</style>
