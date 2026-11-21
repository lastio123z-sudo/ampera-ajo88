<template>
  <nav class="navbar">
    <div class="navbar__left">
      <h1 class="navbar__title">{{ pageTitle }}</h1>
    </div>
    <div class="navbar__right">
      <div class="navbar__user">
        <div class="navbar__avatar">{{ userInitial }}</div>
        <div class="navbar__user-info">
          <span class="navbar__user-name">{{ user?.nama }}</span>
          <span class="navbar__user-role">{{ roleLabel }}</span>
        </div>
        <button class="navbar__logout" @click="handleLogout" title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.currentUser)
const userInitial = computed(() => user.value?.nama?.charAt(0).toUpperCase() || '?')
const pageTitle = computed(() => route.meta.title || 'Ampera Ajo')
const roleLabel = computed(() => {
  const roles = { pemilik: 'Pemilik', kasir: 'Kasir' }
  return roles[user.value?.role] || ''
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: var(--sidebar-width); right: 0;
  height: var(--navbar-height);
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(220, 226, 216, 0.86);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(16px, 2.5vw, 36px);
  z-index: 100;
  box-shadow: 0 5px 20px rgba(35, 54, 41, 0.035);
  backdrop-filter: blur(14px);
}
.navbar__left { display: flex; align-items: center; gap: 14px; }
.navbar__title { font-size: 15px; font-weight: 650; color: #2a4735; letter-spacing: -0.3px; }
.navbar__right { display: flex; align-items: center; }
.navbar__user { display: flex; align-items: center; gap: 11px; }
.navbar__avatar {
  width: 38px; height: 38px; border-radius: 13px;
  background: linear-gradient(145deg, #376f4d, #21432f); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 14px;
  box-shadow: 0 5px 12px rgba(40, 88, 63, 0.18);
}
.navbar__user-info { display: flex; flex-direction: column; }
.navbar__user-name { font-weight: 600; font-size: 11px; line-height: 1.3; color: #2e4034; }
.navbar__user-role { font-size: 9px; color: var(--color-text-muted); }
.navbar__logout {
  display: flex; align-items: center; gap: 5px;
  margin-left: 8px; background: #fff; border: 1px solid #e4e8e0;
  padding: 8px 11px; border-radius: 10px;
  font-size: 10px; font-weight: 600; color: #68746a;
  cursor: pointer; transition: all 0.2s;
}
.navbar__logout:hover { background: var(--color-danger); color: #fff; border-color: var(--color-danger); }
@media (max-width: 768px) {
  .navbar { left: 0; }
  .navbar__title { font-size: 13px; }
}
@media (max-width: 480px) {
  .navbar__user-info { display: none; }
  .navbar__logout { margin-left: 0; padding: 8px; font-size: 0; }
  .navbar__logout svg { width: 17px; height: 17px; }
}
</style>
