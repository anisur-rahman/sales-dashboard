const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export const formatCurrency = (value) => currency.format(value ?? 0)

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value ?? 0)

export const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
