import { ref, watch, toValue } from 'vue'
import { gqlRequest } from '@/graphql/client'

/**
 * Run a GraphQL query and keep the result reactive.
 *
 * A "composable" is a function that packages reusable logic using Vue's
 * Composition API. It replaces Vue 2 mixins.
 *
 * @param {string} query      The GraphQL query string
 * @param {object|Function|Ref} variables  Can be reactive: when it changes,
 *                                         the query runs again automatically.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useQuery(QUERY, () => ({ id: props.id }))
 */
export function useQuery(query, variables = {}) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  let requestId = 0

  async function refetch() {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await gqlRequest(query, toValue(variables))
      // Ignore old responses if a newer request was started meanwhile
      // (e.g. the user typed quickly in a search box).
      if (current === requestId) data.value = result
    } catch (e) {
      if (current === requestId) error.value = e.message
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  // Run now, and again whenever the variables change.
  watch(() => toValue(variables), refetch, { immediate: true, deep: true })

  return { data, loading, error, refetch }
}
