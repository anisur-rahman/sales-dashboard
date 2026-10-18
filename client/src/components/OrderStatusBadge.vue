<script setup>
import { computed } from 'vue'

const props = defineProps({ status: { type: String, required: true } })

// Map each status from the GraphQL enum to a color style.
const toneByStatus = {
  DELIVERED: 'badge-success',
  SHIPPED: 'badge-info',
  PROCESSING: 'badge-warning',
  CANCELLED: 'badge-danger'
}

const tone = computed(() => toneByStatus[props.status] ?? 'badge-info')
const label = computed(() => props.status.charAt(0) + props.status.slice(1).toLowerCase())
</script>

<template>
  <span class="badge" :class="tone">{{ label }}</span>
</template>
