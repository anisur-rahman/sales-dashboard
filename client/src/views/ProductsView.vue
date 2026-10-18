<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@/composables/useQuery'
import { PRODUCTS_QUERY } from '@/graphql/queries'
import StatusMessage from '@/components/StatusMessage.vue'
import ProductTable from '@/components/ProductTable.vue'

const route = useRoute()
const router = useRouter()

// Filters start from the URL (?q=...&category=...) so links are shareable.
const search = ref(route.query.q ?? '')
const category = ref(route.query.category ?? '')

// Debounce: wait 300ms after typing stops before querying the server.
const debouncedSearch = ref(search.value)
let timer
watch(search, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => (debouncedSearch.value = value), 300)
})

// Keep the URL in sync with the filters.
watch([debouncedSearch, category], ([q, c]) => {
  router.replace({ query: { ...(q && { q }), ...(c && { category: c }) } })
})

const { data, loading, error, refetch } = useQuery(PRODUCTS_QUERY, () => ({
  search: debouncedSearch.value || null,
  category: category.value || null
}))

const products = computed(() => data.value?.products ?? [])
const categories = computed(() => data.value?.categories ?? [])

function clearFilters() {
  search.value = ''
  debouncedSearch.value = ''
  category.value = ''
}
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">Products</h1>
      <p class="page-subtitle">{{ products.length }} products</p>
    </div>
  </header>

  <section class="card">
    <form class="filters" role="search" @submit.prevent>
      <label class="field grow">
        Search
        <input v-model="search" class="input" type="search" placeholder="Search by name…" />
      </label>
      <label class="field">
        Category
        <select v-model="category" class="select">
          <option value="">All categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <button v-if="search || category" type="button" class="btn btn-ghost" @click="clearFilters">
        Clear
      </button>
    </form>

    <StatusMessage
      :loading="loading && !data"
      :error="error"
      :empty="!!data && products.length === 0"
      empty-text="No products match your filters."
      @retry="refetch"
    >
      <ProductTable :products="products" />
    </StatusMessage>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap; /* stacks on phones, one row on desktop */
  align-items: flex-end;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.grow {
  flex: 1 1 240px;
}
</style>
