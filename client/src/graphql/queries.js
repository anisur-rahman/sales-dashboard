// All GraphQL operations in one place.
// Each query asks for EXACTLY the fields the page needs — nothing more.
// That is GraphQL's main advantage over REST.

// A fragment is a reusable set of fields.
const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    name
    category
    price
    stock
    rating
    lowStock
    imageColor
  }
`

export const DASHBOARD_QUERY = /* GraphQL */ `
  query Dashboard($region: String) {
    dashboard(region: $region) {
      totalRevenue
      totalOrders
      averageOrderValue
      lowStockCount
      salesByMonth {
        month
        revenue
      }
      salesByRegion {
        region
        revenue
        orderCount
      }
    }
    regions
    recentOrders(limit: 6, region: $region) {
      id
      customer
      region
      total
      status
      date
      product {
        id
        name
      }
    }
  }
`

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query Products($search: String, $category: String) {
    products(search: $search, category: $category) {
      ...ProductFields
    }
    categories
  }
`

export const PRODUCT_DETAIL_QUERY = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query ProductDetail($id: ID!) {
    product(id: $id) {
      ...ProductFields
      totalRevenue
      orders(limit: 5) {
        id
        customer
        quantity
        total
        status
        date
      }
    }
  }
`

export const UPDATE_STOCK_MUTATION = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  mutation UpdateStock($id: ID!, $stock: Int!) {
    updateStock(id: $id, stock: $stock) {
      ...ProductFields
    }
  }
`
