<template>
  <header class="pub-navbar">
    <router-link to="/katalog" class="pub-navbar__brand">
      <span class="pub-navbar__logo">🍛</span>
      <span class="pub-navbar__brand-copy">
        <span class="pub-navbar__title">Ampera Ajo</span>
        <span class="pub-navbar__sub">Masakan Padang · Rasa Minang</span>
      </span>
    </router-link>

    <nav class="pub-navbar__nav" aria-label="Navigasi pelanggan">
      <router-link to="/katalog" class="pub-nav-link">Menu</router-link>
      <router-link to="/status-pesanan" class="pub-nav-link">Lacak Pesanan</router-link>
      <router-link to="/login" class="pub-nav-link pub-nav-link--staff">Masuk Staff</router-link>
    </nav>
  </header>
</template>

<style scoped>
.pub-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px clamp(20px, 5vw, 72px);
  background: rgba(24, 55, 42, 0.96);
  box-shadow: 0 8px 26px rgba(13, 36, 27, 0.14);
  backdrop-filter: blur(14px);
}
.pub-navbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}
.pub-navbar__logo {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid rgba(244, 162, 97, 0.42);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(244, 162, 97, 0.24), rgba(255, 255, 255, 0.08));
  font-size: 25px;
}
.pub-navbar__brand-copy { display: flex; flex-direction: column; gap: 2px; }
.pub-navbar__title { font-size: 17px; font-weight: 700; letter-spacing: -0.3px; }
.pub-navbar__sub { color: rgba(255, 255, 255, 0.64); font-size: 10px; }
.pub-navbar__nav { display: flex; align-items: center; gap: 7px; }
.pub-nav-link {
  padding: 10px 15px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.pub-nav-link:hover, .pub-nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.pub-nav-link--staff {
  margin-left: 5px;
  background: var(--color-secondary);
  color: #30251d;
  font-weight: 600;
}
.pub-nav-link--staff:hover, .pub-nav-link--staff.router-link-exact-active {
  background: #f7b477;
  color: #30251d;
  transform: translateY(-1px);
}
@media (max-width: 600px) {
  .pub-navbar { flex-wrap: wrap; gap: 10px; padding: 10px 16px; }
  .pub-navbar__nav { width: 100%; justify-content: space-between; gap: 4px; }
  .pub-nav-link { padding: 8px 10px; font-size: 11px; }
  .pub-nav-link--staff { margin-left: 0; }
}
</style>
