<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Embeds a Tableau dashboard using Tableau's Embedding API v3.
 *
 * How it works:
 * 1. Load Tableau's script once. It registers a Web Component: <tableau-viz>.
 * 2. Render <tableau-viz src="..."> in the template.
 * 3. Listen for its events (e.g. "firstinteractive" when it's ready).
 *
 * vite.config.js tells Vue that tags starting with "tableau-" are custom
 * elements, so Vue doesn't warn about an unknown component.
 */
const props = defineProps({
  src: { type: String, required: true },
  height: { type: String, default: '720px' }
})

const SCRIPT_URL = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js'

const status = ref('loading') // 'loading' | 'ready' | 'error'
const vizRef = ref(null) // template ref: gives us the real DOM element

// Add the script tag only once, even if this component is used many times.
function loadTableauScript() {
  if (!document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = SCRIPT_URL
    script.onerror = () => (status.value = 'error')
    document.head.appendChild(script)
  }
  // Resolves when the browser knows what <tableau-viz> is.
  return customElements.whenDefined('tableau-viz')
}

function onReady() {
  status.value = 'ready'
}

onMounted(async () => {
  vizRef.value?.addEventListener('firstinteractive', onReady)
  await loadTableauScript()
  // If the "ready" event doesn't arrive (slow network), show the viz anyway.
  setTimeout(() => status.value === 'loading' && onReady(), 8000)
})

// Clean up event listeners when the component is removed.
onBeforeUnmount(() => {
  vizRef.value?.removeEventListener('firstinteractive', onReady)
})

// Expose a method the parent can call through a template ref.
// revertAllAsync() undoes any filters/selections the user made in the viz.
async function reset() {
  await vizRef.value?.revertAllAsync?.()
}
defineExpose({ reset })
</script>

<template>
  <div class="wrapper" :style="{ minHeight: height }">
    <p v-if="status === 'loading'" class="overlay">Loading Tableau dashboard…</p>
    <div v-else-if="status === 'error'" class="overlay error">
      <p>Couldn't load Tableau. Check your internet connection or the dashboard URL.</p>
      <a :href="props.src" target="_blank" rel="noopener">Open the dashboard on Tableau Public</a>
    </div>

    <tableau-viz
      v-show="status !== 'error'"
      ref="vizRef"
      :src="src"
      toolbar="bottom"
      hide-tabs
      width="100%"
      :height="height"
    />
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  overflow-x: auto; /* wide dashboards scroll inside the card, not the page */
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  color: var(--color-muted);
  text-align: center;
  pointer-events: none;
}

.overlay.error {
  pointer-events: auto;
  color: var(--color-danger);
}
</style>
