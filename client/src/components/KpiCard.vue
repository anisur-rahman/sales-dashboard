<script setup>
// A small, reusable "stat tile". Props in, nothing out.
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  hint: { type: String, default: '' },
  tone: { type: String, default: 'default' } // 'default' | 'warning'
})
</script>

<template>
  <article class="card kpi" :class="`tone-${tone}`">
    <p class="label">{{ label }}</p>
    <p class="value">{{ value }}</p>
    <p v-if="hint" class="hint">{{ hint }}</p>
  </article>
</template>

<style scoped>
.kpi {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.label {
  font-size: var(--text-sm);
  color: var(--color-muted);
}

.value {
  font-size: var(--text-xl);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.hint {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.tone-warning .value {
  color: var(--color-warning);
}
</style>
