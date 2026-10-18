<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

// A bar chart built with plain HTML/CSS (no chart library), so you can see
// exactly how data becomes layout. Bar height = value / max value.
const props = defineProps({
  data: { type: Array, required: true } // [{ month, revenue }]
})

const max = computed(() => Math.max(...props.data.map((d) => d.revenue), 1))

const bars = computed(() =>
  props.data.map((d) => ({
    ...d,
    percent: (d.revenue / max.value) * 100
  }))
)
</script>

<template>
  <section class="card">
    <h2 class="card-title">Revenue by month</h2>
    <!-- role="img" + aria-label describes the chart for screen readers -->
    <div class="chart" role="img" :aria-label="`Monthly revenue, highest ${formatCurrency(max)}`">
      <div v-for="bar in bars" :key="bar.month" class="col">
        <div class="track">
          <div class="bar" :style="{ height: bar.percent + '%' }" :title="formatCurrency(bar.revenue)" />
        </div>
        <span class="month">{{ bar.month }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The card grows to match the card next to it; the chart fills the space */
.card {
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-1);
  min-height: 220px;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 0;
}

.track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  max-width: 28px;
  margin: 0 auto;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: var(--color-primary);
  transition: height 0.4s ease;
}

.month {
  font-size: 0.7rem;
  color: var(--color-muted);
}

/* On very narrow phones, show every other month label */
@media (max-width: 420px) {
  .col:nth-child(even) .month {
    visibility: hidden;
  }
}
</style>
