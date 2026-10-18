import { ref } from 'vue'
import { gqlRequest } from '@/graphql/client'

// loading, error, and empty.
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
