// Dummy data for the mock GraphQL API.
// In a real job this would come from a database. Here it lives in memory,
// so changes made by mutations reset when the server restarts.

export const regions = ['North', 'South', 'East', 'West']

export const categories = ['Laptops', 'Monitors', 'Accessories', 'Audio']

export const products = [
  { id: '1', name: 'ProBook 14', category: 'Laptops', price: 1199, stock: 42, rating: 4.6, imageColor: '#4f46e5' },
  { id: '2', name: 'AirLite 13', category: 'Laptops', price: 899, stock: 8, rating: 4.3, imageColor: '#6366f1' },
  { id: '3', name: 'Studio 16 Max', category: 'Laptops', price: 2499, stock: 15, rating: 4.8, imageColor: '#4338ca' },
  { id: '4', name: 'UltraView 27"', category: 'Monitors', price: 449, stock: 60, rating: 4.5, imageColor: '#0891b2' },
  { id: '5', name: 'CurveWide 34"', category: 'Monitors', price: 699, stock: 0, rating: 4.4, imageColor: '#0e7490' },
  { id: '6', name: 'PortaScreen 15"', category: 'Monitors', price: 229, stock: 33, rating: 4.1, imageColor: '#06b6d4' },
  { id: '7', name: 'Mech Keyboard K2', category: 'Accessories', price: 129, stock: 120, rating: 4.7, imageColor: '#059669' },
  { id: '8', name: 'Glide Mouse', category: 'Accessories', price: 59, stock: 5, rating: 4.2, imageColor: '#10b981' },
  { id: '9', name: 'USB-C Hub 8-in-1', category: 'Accessories', price: 79, stock: 88, rating: 4.0, imageColor: '#047857' },
  { id: '10', name: 'NoiseOff Headphones', category: 'Audio', price: 299, stock: 27, rating: 4.6, imageColor: '#d97706' },
  { id: '11', name: 'PodBuds Pro', category: 'Audio', price: 179, stock: 3, rating: 4.3, imageColor: '#f59e0b' },
  { id: '12', name: 'DeskSpeaker Duo', category: 'Audio', price: 149, stock: 40, rating: 3.9, imageColor: '#b45309' }
]

const customers = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark Ind.', 'Wayne Ent.', 'Hooli', 'Vandelay']
const statuses = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CANCELLED']

// Generate 120 orders with a fixed seed so the data is the same every run.
// (mulberry32: a small, well-known seeded random number generator)
let seed = 20251017
function random() {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
function pick(list) {
  return list[Math.floor(random() * list.length)]
}

export const orders = Array.from({ length: 120 }, (_, i) => {
  const product = pick(products)
  const quantity = 1 + Math.floor(random() * 5)
  const month = Math.floor(random() * 12) // 0 = Jan ... 11 = Dec
  const day = 1 + Math.floor(random() * 28)
  return {
    id: String(1001 + i),
    productId: product.id,
    customer: pick(customers),
    region: pick(regions),
    quantity,
    total: product.price * quantity,
    status: pick(statuses),
    date: new Date(Date.UTC(2025, month, day)).toISOString().slice(0, 10)
  }
})
