<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@/composables/useQuery'
import { useMutation } from '@/composables/useMutation'
import { PRODUCT_DETAIL_QUERY, UPDATE_STOCK_MUTATION } from '@/graphql/queries'
import { formatCurrency, formatDate } from '@/utils/format'
import StatusMessage from '@/components/StatusMessage.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'

// The router passes :id as a prop because of `props: true` in router/index.js
const props = defineProps({ id: { type: String, required: true } })

const { data, loading, error, refetch } = useQuery(PRODUCT_DETAIL_QUERY, () => ({ id: props.id }))
const product = computed(() => data.value?.product)

// ----- Mutation: update stock -----
const stockInput = ref(0)
const saved = ref(false)
const { mutate, loading: saving, error: saveError } = useMutation(UPDATE_STOCK_MUTATION)

// When the product loads, put its current stock in the input.
watch(product, (p) => p && (stockInput.value = p.stock), { immediate: true })

async function saveStock() {
  saved.value = false
  const result = await mutate({ id: props.id, stock: Number(stockInput.value) })
  if (result) {
    // Update the local data with the server's response (no extra request).
    data.value.product = { ...data.value.product, ...result.updateStock }
    saved.value = true
  }
}
</script>

<template>
  <RouterLink to="/products" class="back">← All products</RouterLink>

  <StatusMessage
    :loading="loading && !data"
    :error="error"
    :empty="!!data && !product"
    empty-text="Product not found."
    @retry="refetch"
  >
    <template v-if="product">
      <header class="page-header">
        <div class="title-row">
          <span class="swatch" :style="{ background: product.imageColor }" aria-hidden="true" />
          <div>
            <h1 class="page-title">{{ product.name }}</h1>
            <p class="page-subtitle">{{ product.category }} · ★ {{ product.rating.toFixed(1) }}</p>
          </div>
        </div>
      </header>

      <div class="grid-auto">
        <div class="card stat">
          <span class="page-subtitle">Price</span>
          <strong>{{ formatCurrency(product.price) }}</strong>
        </div>
        <div class="card stat">
          <span class="page-subtitle">Total revenue</span>
          <strong>{{ formatCurrency(product.totalRevenue) }}</strong>
        </div>
        <div class="card stat">
          <span class="page-subtitle">In stock</span>
          <strong :class="{ warn: product.lowStock }">{{ product.stock }}</strong>
        </div>
      </div>

      <div class="grid-2">
        <section class="card">
          <h2 class="card-title">Latest orders</h2>
          <p v-if="!product.orders.length" class="page-subtitle">No orders yet.</p>
          <ul v-else class="orders">
            <li v-for="o in product.orders" :key="o.id">
              <span>#{{ o.id }} · {{ o.customer }} · ×{{ o.quantity }}</span>
              <span class="right">
                {{ formatCurrency(o.total) }} · {{ formatDate(o.date) }}
                <OrderStatusBadge :status="o.status" />
              </span>
            </li>
          </ul>
        </section>

        <section class="card">
          <h2 class="card-title">Update stock</h2>
          <!-- A GraphQL mutation in action -->
          <form class="stock-form" @submit.prevent="saveStock">
            <label class="field">
              Units in stock
              <input v-model.number="stockInput" class="input" type="number" min="0" required />
            </label>
            <button class="btn" type="submit" :disabled="saving">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
          </form>
          <p v-if="saved" class="msg ok" role="status">Saved.</p>
          <p v-if="saveError" class="msg err" role="alert">{{ saveError }}</p>
        </section>
      </div>
    </template>
  </StatusMessage>
</template>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.swatch {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat strong {
  font-size: var(--text-xl);
  font-variant-numeric: tabular-nums;
}

.warn {
  color: var(--color-warning);
}

.orders {
  list-style: none;
  margin: 0;
  padding: 0;
}

.orders li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border);
  font-size: var(--text-sm);
}

.orders li:first-child {
  border-top: 0;
  padding-top: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-muted);
}

.stock-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-3);
}

.stock-form .field {
  flex: 1 1 140px;
}

.msg {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
}

.ok {
  color: var(--color-success);
}

.err {
  color: var(--color-danger);
}
</style>
