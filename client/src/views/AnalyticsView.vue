<script setup>
import { ref } from 'vue'
import TableauEmbed from '@/components/TableauEmbed.vue'

// The dashboard URL comes from .env so it can change without code edits.
const tableauUrl =
  import.meta.env.VITE_TABLEAU_URL ||
  'https://public.tableau.com/views/Superstore_embedded_800x800/Overview'

// Template ref to call a method the child exposes with defineExpose().
const tableau = ref(null)
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">Embedded Tableau dashboard (Tableau Public sample)</p>
    </div>
    <button class="btn btn-ghost" type="button" @click="tableau?.reset()">Reset view</button>
  </header>

  <section class="card">
    <TableauEmbed ref="tableau" :src="tableauUrl" height="820px" />
  </section>

  <p class="page-subtitle note">
    To show a different dashboard, set <code>VITE_TABLEAU_URL</code> in <code>client/.env</code> to any
    public view from public.tableau.com.
  </p>
</template>

<style scoped>
.note {
  margin-top: var(--space-3);
}
</style>
