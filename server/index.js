import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema.js'

const PORT = process.env.PORT || 4000

// Yoga turns the schema into an HTTP endpoint at /graphql.
// It also serves GraphiQL, an in-browser tool for trying queries.
const yoga = createYoga({
  schema,
  graphiql: true,
  // Allow the Vite dev server to call this API.
  cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }
})

const server = createServer(yoga)

server.listen(PORT, () => {
  console.log(`GraphQL API ready at http://localhost:${PORT}/graphql`)
  console.log('Open that link in your browser to try queries in GraphiQL.')
})
