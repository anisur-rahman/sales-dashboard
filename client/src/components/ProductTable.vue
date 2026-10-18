<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({ products: { type: Array, required: true } })
</script>

<template>
  <!--
    Responsive table technique:
    - Desktop: a normal table.
    - Phones: each row becomes a card, and data-label shows the column name.
    Same HTML, different CSS. Works in every modern browser.
  -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col">Category</th>
        <th scope="col" class="num">Price</th>
        <th scope="col" class="num">Stock</th>
        <th scope="col" class="num">Rating</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in products" :key="p.id">
        <td data-label="Product">
          <RouterLink :to="{ name: 'product-detail', params: { id: p.id } }" class="name">
            <span class="swatch" :style="{ background: p.imageColor }" aria-hidden="true" />
            {{ p.name }}
          </RouterLink>
        </td>
        <td data-label="Category">{{ p.category }}</td>
        <td data-label="Price" class="num">{{ formatCurrency(p.price) }}</td>
        <td data-label="Stock" class="num">
          <span v-if="p.stock === 0" class="badge badge-danger">Out of stock</span>
          <span v-else-if="p.lowStock" class="badge badge-warning">{{ p.stock }} left</span>
          <span v-else>{{ p.stock }}</span>
        </td>
        <td data-label="Rating" class="num">★ {{ p.rating.toFixed(1) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-muted);
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.name {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  flex-shrink: 0;
}

tbody tr:hover {
  background: var(--color-bg);
}

/* ---------- Phones: rows become cards ---------- */
@media (max-width: 640px) {
  thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .table,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  tr {
    margin-bottom: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
  }

  td {
    display: flex;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-2) 0;
    border-bottom: 1px dashed var(--color-border);
    text-align: right;
  }

  td:last-child {
    border-bottom: 0;
  }

  /* Show the column name from data-label before each value */
  td::before {
    content: attr(data-label);
    font-size: var(--text-sm);
    color: var(--color-muted);
    text-align: left;
  }
}
</style>
