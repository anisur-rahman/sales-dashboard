<script setup>
// Shown only on small screens (see CSS). Holds the menu button.
defineProps({ menuOpen: Boolean })
defineEmits(['toggle-menu'])
</script>

<template>
  <header class="topbar">
    <button
      class="menu-btn"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="sidebar"
      @click="$emit('toggle-menu')"
    >
      <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          :d="menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          fill="none"
        />
      </svg>
    </button>
    <span class="brand">Sales<b>Board</b></span>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 56px;
  padding: 0 var(--space-3);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.menu-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.brand {
  font-size: var(--text-lg);
}

.brand b {
  color: var(--color-primary);
}

@media (min-width: 900px) {
  .topbar {
    display: none;
  }
}
</style>
