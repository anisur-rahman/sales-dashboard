<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  data: { type: Array, required: true }, // [{ region, revenue, orderCount }]
  selected: { type: String, default: '' }
})

// Emitting lets the PARENT decide what happens when a region is clicked.
const emit = defineEmits(['select'])

const total = computed(() => props.data.reduce((s, r) => s + r.revenue, 0) || 1)

const rows = computed(() =>
  [...props.data]
    .sort((a, b) => b.revenue - a.revenue)
    .map((r) => ({ ...r, share: Math.round((r.revenue / total.value) * 100) }))
)

function toggle(region) {
  emit('select', props.selected === region ? '' : region)
}
</script>

<template>
  <section class="card">
    <h2 class="card-title">Sales by region</h2>
    <ul class="list">
      <li v-for="row in rows" :key="row.region">
        <button
          type="button"
          class="row"
          :class="{ active: selected === row.region }"
          :aria-pressed="selected === row.region"
          @click="toggle(row.region)"
        >
          <span class="top">
            <span>{{ row.region }}</span>
            <span class="amount">{{ formatCurrency(row.revenue) }}</span>
          </span>
          <span class="track"><span class="fill" :style="{ width: row.share + '%' }" /></span>
          <span class="meta">{{ row.share }}% · {{ row.orderCount }} orders</span>
        </button>
      </li>
    </ul>
    <p class="tip">Tap a region to filter the dashboard.</p>
  </section>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.row {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.row:hover {
  background: var(--color-bg);
}

.row.active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.top {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.amount {
  font-variant-numeric: tabular-nums;
}

.track {
  height: 8px;
  border-radius: 999px;
  background: var(--color-bg);
  overflow: hidden;
}

.fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary);
  transition: width 0.4s ease;
}

.meta,
.tip {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.tip {
  margin-top: var(--space-3);
}
</style>
