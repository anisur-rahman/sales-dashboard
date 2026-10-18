<script setup>
import OrderStatusBadge from './OrderStatusBadge.vue'
import { formatCurrency, formatDate } from '@/utils/format'

defineProps({ orders: { type: Array, required: true } })
</script>

<template>
  <section class="card">
    <h2 class="card-title">Recent orders</h2>
    <ul class="orders">
      <li v-for="order in orders" :key="order.id" class="order">
        <div class="main">
          <RouterLink :to="`/products/${order.product.id}`" class="product">
            {{ order.product.name }}
          </RouterLink>
          <span class="sub">#{{ order.id }} · {{ order.customer }} · {{ order.region }}</span>
        </div>
        <div class="side">
          <span class="total">{{ formatCurrency(order.total) }}</span>
          <span class="sub">{{ formatDate(order.date) }}</span>
          <OrderStatusBadge :status="order.status" />
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.orders {
  list-style: none;
  margin: 0;
  padding: 0;
}

.order {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) 0;
  border-top: 1px solid var(--color-border);
}

.order:first-child {
  border-top: 0;
  padding-top: 0;
}

.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.product {
  font-weight: 600;
}

.side {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.total {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sub {
  font-size: 0.8rem;
  color: var(--color-muted);
}
</style>
