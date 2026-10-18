<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopBar from '@/components/layout/AppTopBar.vue'

// On phones the sidebar is a slide-in drawer; this controls it.
const menuOpen = ref(false)

// Close the drawer whenever the user navigates to another page.
const route = useRoute()
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <div class="shell">
    <AppTopBar @toggle-menu="menuOpen = !menuOpen" :menu-open="menuOpen" />
    <AppSidebar :open="menuOpen" @close="menuOpen = false" />

    <main class="content" id="main">
      <!-- The current page from the router renders here -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.content {
  padding: var(--space-4);
  max-width: 1280px;
}

/* Desktop: sidebar is always visible, content moves right */
@media (min-width: 900px) {
  .content {
    margin-left: var(--sidebar-width);
    padding: var(--space-6);
  }
}
</style>
