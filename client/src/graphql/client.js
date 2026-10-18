// A tiny GraphQL client built on fetch().
//
// Every GraphQL request is an HTTP POST to ONE endpoint with a JSON body:
//   { "query": "...", "variables": { ... } }
// The response is always:
//   { "data": { ... }, "errors": [ ... ] }   (errors only when something failed)
//
// In larger projects you'd often use Apollo Client or urql instead, which add.


const ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || '/graphql'

export async function gqlRequest(query, variables = {}) {
  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })
  } catch {
    // fetch() itself only fails on network problems (server down, offline)
    throw new Error('Cannot reach the GraphQL server. Is it running on port 4000?')
  }

  if (!response.ok) {
    throw new Error(`Server responded with ${response.status}`)
  }

  const { data, errors } = await response.json()

  // GraphQL often returns HTTP 200 even when a resolver failed,
  // so you must check the "errors" array yourself.
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }

  return data
}
