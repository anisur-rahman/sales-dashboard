<script setup>
// One component for the three states every data screen needs:
// loading, error, and empty.
defineProps({
  loading: Boolean,
  error: { type: String, default: null },
  empty: Boolean,
  emptyText: { type: String, default: 'Nothing to show.' }
})
defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="status" role="status">
    <span class="spinner" aria-hidden="true" />
    Loading…
  </div>

  <div v-else-if="error" class="status error" role="alert">
    <p>{{ error }}</p>
    <button class="btn btn-ghost" type="button" @click="$emit('retry')">Try again</button>
  </div>

  <div v-else-if="empty" class="status">{{ emptyText }}</div>

  <!-- Otherwise show whatever the parent put inside this component -->
  <slot v-else />
</template>

<style scoped>
.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4);
  color: var(--color-muted);
  text-align: center;
}

.error {
  color: var(--color-danger);
  flex-direction: column;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
