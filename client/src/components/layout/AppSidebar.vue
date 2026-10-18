<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])

// Navigation items. Adding a page = add a route + one line here.
const links = [
  { to: '/', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { to: '/products', label: 'Products', icon: 'M20 7l-8-4-8 4v10l8 4 8-4V7zm-8 2L6 6.2 12 3.3l6 2.9L12 9z' },
  { to: '/analytics', label: 'Analytics', icon: 'M4 20V10h3v10H4zm6 0V4h3v16h-3zm6 0v-7h3v7h-3z' }
]
</script>

<template>
  <!-- Dark overlay behind the drawer on phones; tap it to close -->
  <div v-if="open" class="backdrop" @click="$emit('close')" />

  <nav id="sidebar" class="sidebar" :class="{ open }" aria-label="Main">
    <div class="brand">Sales<b>Board</b></div>
    <ul>
      <li v-for="link in links" :key="link.to">
        <RouterLink :to="link.to" class="nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="link.icon" fill="currentColor" />
          </svg>
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
    <p class="note">Demo data · mock GraphQL API</p>
  </nav>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  padding: var(--space-5) var(--space-3);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  /* Hidden off-screen on phones */
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.sidebar.open {
  transform: translateX(0);
}

.backdrop {
  position: fixed;
  inset: 0;
  z-index: 35;
  background: rgba(10, 12, 25, 0.45);
}

.brand {
  padding: 0 var(--space-3) var(--space-5);
  font-size: var(--text-lg);
}

.brand b {
  color: var(--color-primary);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: 8px;
  color: var(--color-muted);
  font-weight: 500;
}

.nav-link:hover {
  background: var(--color-bg);
  text-decoration: none;
}

/* Vue Router adds this class to the link for the current page */
.nav-link.router-link-exact-active,
.nav-link.router-link-active:not([href='/']) {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.note {
  margin-top: auto;
  padding: 0 var(--space-3);
  font-size: 0.75rem;
  color: var(--color-muted);
}

/* Desktop: always visible, no drawer behavior */
@media (min-width: 900px) {
  .sidebar {
    transform: none;
    transition: none;
  }
  .backdrop {
    display: none;
  }
}
</style>
