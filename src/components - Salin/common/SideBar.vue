<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar__logo">
      <div class="sidebar__logo-icon">🍛</div>
      <div class="sidebar__logo-text">
        <span class="sidebar__logo-name">Ampera Ajo</span>
        <span class="sidebar__logo-sub">Warung Padang</span>
      </div>
    </div>

    <nav class="sidebar__nav">
      <ul class="sidebar__menu">
        <li v-for="item in menuItems" :key="item.to" class="sidebar__item">
          <router-link
            :to="item.to"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isActive(item.to) }"
          >
            <span class="sidebar__icon" v-html="item.icon"></span>
            <span class="sidebar__label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar__footer">
      <div class="sidebar__version">v1.0.0</div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({ collapsed: { type: Boolean, default: false } })

const route = useRoute()
const authStore = useAuthStore()

const pemilikMenu = [
  { to: '/pemilik/dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { to: '/pemilik/produk', label: 'Manajemen Produk', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' },
  { to: '/pemilik/laporan', label: 'Laporan Penjualan', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  { to: '/pemilik/kasir', label: 'Manajemen Kasir', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>' }
]

const kasirMenu = [
  { to: '/kasir/dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { to: '/kasir/transaksi-baru', label: 'Transaksi Baru', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' },
  { to: '/kasir/pesanan-online', label: 'Pesanan Online', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>' },
  { to: '/kasir/riwayat', label: 'Riwayat Transaksi', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' }
]

const menuItems = computed(() => {
  if (authStore.isPemilik) return pemilikMenu
  if (authStore.isKasir) return kasirMenu
  return []
})

function isActive(to) {
  return route.path.startsWith(to)
}
</script>

<style scoped>
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: var(--sidebar-width);
  background:
    radial-gradient(circle at 0 0, rgba(233, 178, 112, 0.12), transparent 34%),
    linear-gradient(180deg, #1d4431, #173728 72%, #153324);
  display: flex; flex-direction: column;
  z-index: 200;
  transition: transform 0.3s;
  box-shadow: 8px 0 32px rgba(19, 44, 29, 0.1);
}
.sidebar__logo {
  display: flex; align-items: center; gap: 10px;
  padding: 22px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.09);
}
.sidebar__logo-icon {
  display: grid; width: 42px; height: 42px; place-items: center;
  border: 1px solid rgba(233, 178, 112, 0.38); border-radius: 14px;
  background: linear-gradient(145deg, rgba(233, 178, 112, 0.23), rgba(255,255,255,0.08));
  font-size: 24px;
}
.sidebar__logo-text { display: flex; flex-direction: column; }
.sidebar__logo-name { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
.sidebar__logo-sub { font-size: 9px; color: rgba(255,255,255,0.55); letter-spacing: 0.35px; }
.sidebar__nav { flex: 1; overflow-y: auto; padding: 17px 0; }
.sidebar__menu { list-style: none; }
.sidebar__item { margin: 3px 10px; }
.sidebar__link {
  display: flex; align-items: center; gap: 10px;
  min-height: 43px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  color: rgba(255,255,255,0.68);
  font-size: 11px; font-weight: 500;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
  text-decoration: none;
}
.sidebar__link:hover { background: rgba(255,255,255,0.075); color: #fff; transform: translateX(2px); }
.sidebar__link--active { border-color: rgba(233, 178, 112, 0.15); background: rgba(233, 178, 112, 0.15); color: #f3cb91; font-weight: 600; }
.sidebar__icon { flex-shrink: 0; display: flex; align-items: center; }
.sidebar__icon :deep(svg) { width: 17px; height: 17px; }
.sidebar__footer {
  padding: 14px 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.sidebar__version { font-size: 9px; color: rgba(255,255,255,0.35); letter-spacing: 0.5px; }
@media (max-width: 768px) {
  .sidebar {
    top: auto; right: 0; bottom: 0; left: 0;
    width: 100%; height: 67px; flex-direction: row;
    box-shadow: 0 -7px 24px rgba(19, 44, 29, 0.13);
  }
  .sidebar__logo, .sidebar__footer { display: none; }
  .sidebar__nav { padding: 6px 8px; overflow-x: auto; overflow-y: hidden; }
  .sidebar__menu { display: flex; width: max-content; min-width: 100%; justify-content: space-around; gap: 4px; }
  .sidebar__item { margin: 0; }
  .sidebar__link {
    min-width: 60px; min-height: 52px; flex-direction: column; justify-content: center;
    gap: 2px; padding: 4px 8px; border-radius: 11px; font-size: 8px;
  }
  .sidebar__link:hover { transform: none; }
  .sidebar__icon :deep(svg) { width: 16px; height: 16px; }
}
</style>
