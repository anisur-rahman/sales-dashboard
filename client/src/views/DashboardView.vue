<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@/composables/useQuery'
import { DASHBOARD_QUERY } from '@/graphql/queries'
import { useFiltersStore } from '@/stores/filters'
import { formatCurrency, formatNumber } from '@/utils/format'
import StatusMessage from '@/components/StatusMessage.vue'
import KpiCard from '@/components/KpiCard.vue'
import MonthlyChart from '@/components/MonthlyChart.vue'
import RegionBreakdown from '@/components/RegionBreakdown.vue'
import RecentOrders from '@/components/RecentOrders.vue'

// Shared filter state from Pinia. storeToRefs keeps "region" reactive.
const filters = useFiltersStore()
const { region, regionLabel } = storeToRefs(filters)

// Variables are a function, so the query re-runs when the region changes.
const { data, loading, error, refetch } = useQuery(DASHBOARD_QUERY, () => ({
  region: region.value || null
}))

const summary = computed(() => data.value?.dashboard)

const kpis = computed(() => {
  if (!summary.value) return []
  const s = summary.value
  return [
    { label: 'Total revenue', value: formatCurrency(s.totalRevenue), hint: regionLabel.value },
    { label: 'Orders', value: formatNumber(s.totalOrders), hint: 'Excludes cancelled' },
    { label: 'Avg. order value', value: formatCurrency(s.averageOrderValue) },
    {
      label: 'Low-stock products',
      value: String(s.lowStockCount),
      hint: 'Fewer than 10 units',
      tone: s.lowStockCount ? 'warning' : 'default'
    }
  ]
})
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Sales overview · {{ regionLabel }}</p>
    </div>

    <label class="field">
      Region
      <select class="select" :value="region" @change="filters.setRegion($event.target.value)">
        <option value="">All regions</option>
        <option v-for="r in data?.regions ?? []" :key="r" :value="r">{{ r }}</option>
      </select>
    </label>
  </header>

  <!-- Show loading only on the first load; afterwards keep old data visible -->
  <StatusMessage :loading="loading && !data" :error="error" @retry="refetch">
    <template v-if="summary">
      <section class="grid-auto" aria-label="Key metrics">
        <KpiCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
      </section>

      <div class="grid-2">
        <MonthlyChart :data="summary.salesByMonth" />
        <RegionBreakdown
          :data="summary.salesByRegion"
          :selected="region"
          @select="filters.setRegion"
        />
      </div>

      <div class="orders">
        <RecentOrders :orders="data.recentOrders" />
      </div>
    </template>
  </StatusMessage>
</template>

<style scoped>
.orders {
  margin-top: var(--space-4);
}
</style>
