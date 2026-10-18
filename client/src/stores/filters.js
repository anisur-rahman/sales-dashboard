import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// A Pinia store holds state shared across pages.
// Here: the selected region. The Dashboard sets it, and it is still
// selected when you navigate away and come back.
export const useFiltersStore = defineStore('filters', () => {
  const region = ref('') // '' means "All regions"

  const regionLabel = computed(() => region.value || 'All regions')

  function setRegion(value) {
    region.value = value
  }

  return { region, regionLabel, setRegion }
})
