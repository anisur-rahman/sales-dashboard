import { createSchema } from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { products, orders, regions } from './data.js'

// ---------------------------------------------------------------------------
// 1. TYPE DEFINITIONS (the "contract" between frontend and backend)
//    The client can only ask for the types and fields listed here.
// ---------------------------------------------------------------------------
const typeDefs = /* GraphQL */ `
  enum OrderStatus {
    DELIVERED
    SHIPPED
    PROCESSING
    CANCELLED
  }

  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    stock: Int!
    rating: Float!
    imageColor: String!
    "Computed field: true when stock is below 10"
    lowStock: Boolean!
    "Nested relation: orders that contain this product"
    orders(limit: Int = 5): [Order!]!
    totalRevenue: Float!
  }

  type Order {
    id: ID!
    customer: String!
    region: String!
    quantity: Int!
    total: Float!
    status: OrderStatus!
    date: String!
    "Nested relation: the product in this order"
    product: Product!
  }

  type RegionSales {
    region: String!
    revenue: Float!
    orderCount: Int!
  }

  type MonthlySales {
    month: String!
    revenue: Float!
  }

  type DashboardSummary {
    totalRevenue: Float!
    totalOrders: Int!
    averageOrderValue: Float!
    lowStockCount: Int!
    salesByRegion: [RegionSales!]!
    salesByMonth: [MonthlySales!]!
  }

  type Query {
    dashboard(region: String): DashboardSummary!
    products(search: String, category: String): [Product!]!
    product(id: ID!): Product
    categories: [String!]!
    regions: [String!]!
    recentOrders(limit: Int = 8, region: String): [Order!]!
  }

  type Mutation {
    "Change a product's stock level and return the updated product"
    updateStock(id: ID!, stock: Int!): Product!
  }
`

// ---------------------------------------------------------------------------
// 2. RESOLVERS (functions that return the data for each field)
// ---------------------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const activeOrders = () => orders.filter((o) => o.status !== 'CANCELLED')

const round = (n) => Math.round(n * 100) / 100

const resolvers = {
  Query: {
    dashboard: (_parent, { region }) => {
      const list = activeOrders().filter((o) => !region || o.region === region)
      const totalRevenue = list.reduce((sum, o) => sum + o.total, 0)

      return {
        totalRevenue,
        totalOrders: list.length,
        averageOrderValue: list.length ? round(totalRevenue / list.length) : 0,
        lowStockCount: products.filter((p) => p.stock < 10).length,
        salesByRegion: regions.map((r) => {
          const inRegion = activeOrders().filter((o) => o.region === r)
          return {
            region: r,
            revenue: inRegion.reduce((s, o) => s + o.total, 0),
            orderCount: inRegion.length
          }
        }),
        salesByMonth: MONTHS.map((month, i) => ({
          month,
          revenue: list
            .filter((o) => Number(o.date.slice(5, 7)) - 1 === i)
            .reduce((s, o) => s + o.total, 0)
        }))
      }
    },

    products: (_parent, { search, category }) =>
      products.filter((p) => {
        const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = !category || p.category === category
        return matchesSearch && matchesCategory
      }),

    product: (_parent, { id }) => products.find((p) => p.id === id) ?? null,

    categories: () => [...new Set(products.map((p) => p.category))],

    regions: () => regions,

    recentOrders: (_parent, { limit, region }) =>
      [...orders]
        .filter((o) => !region || o.region === region)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
  },

  Mutation: {
    updateStock: (_parent, { id, stock }) => {
      const product = products.find((p) => p.id === id)
      if (!product) throw new GraphQLError(`Product ${id} not found`)
      if (stock < 0) throw new GraphQLError('Stock cannot be negative')
      product.stock = stock
      return product
    }
  },

  // Field resolvers: run only when the client asks for these fields.
  Product: {
    lowStock: (p) => p.stock < 10,
    orders: (p, { limit }) => orders.filter((o) => o.productId === p.id).slice(0, limit),
    totalRevenue: (p) =>
      activeOrders()
        .filter((o) => o.productId === p.id)
        .reduce((s, o) => s + o.total, 0)
  },

  Order: {
    product: (o) => products.find((p) => p.id === o.productId)
  }
}

export const schema = createSchema({ typeDefs, resolvers })
