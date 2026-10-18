import { ref } from 'vue'
import { gqlRequest } from '@/graphql/client'

/**
 * Run a GraphQL mutation when you call mutate(), not automatically.
 *
 * Usage:
 *   const { mutate, loading, error } = useMutation(UPDATE_STOCK_MUTATION)
 *   const result = await mutate({ id: '1', stock: 20 })
 */
export function useMutation(mutation) {
  const loading = ref(false)
  const error = ref(null)

  async function mutate(variables) {
    loading.value = true
    error.value = null
    try {
      return await gqlRequest(mutation, variables)
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return { mutate, loading, error }
}
