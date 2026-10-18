# SalesBoard: Vue 3 + GraphQL + Tableau practice project

A small but complete sales dashboard built to practice the skills in this job description:

> a) Responsive layouts with HTML, CSS, JavaScript
> b) Cross-browser and cross-device compatibility
> c) Implementing UI/UX designs and wireframes
> d) Application features in **Vue 3** and **Tableau**
> e) **GraphQL** APIs to fetch and display data

It has two parts:

- **`server/`**: a mock GraphQL API (Node + GraphQL Yoga) with dummy products and orders
- **`client/`**: the Vue 3 app (Vite + Vue Router + Pinia) that displays that data

---

## 1. Run it on your Mac

You need Node.js 20.19+ or 22.12+ (check with `node -v`).

```bash
cd sales-dashboard
npm install      # installs root, server, and client packages
npm run dev      # starts the API (port 4000) and the Vue app (port 5173)
```

Then open:

| URL | What it is |
|---|---|
| http://localhost:5173 | The Vue app |
| http://localhost:4000/graphql | **GraphiQL**, a browser playground for writing GraphQL queries |

Stop both servers with **Ctrl + C**.

**Run them separately instead (two Terminal tabs):**

```bash
# Tab 1
cd sales-dashboard/server && npm start

# Tab 2
cd sales-dashboard/client && npm run dev
```

**Optional settings:** copy `client/.env.example` to `client/.env` to change the Tableau dashboard URL.

---

## 2. Folder structure

```
sales-dashboard/
├── package.json                 ← runs server + client together (npm run dev)
├── README.md
│
├── server/                      ← MOCK GRAPHQL API
│   ├── index.js                 ← starts the HTTP server on port 4000
│   ├── schema.js                ← GraphQL type definitions + resolvers
│   └── data.js                  ← dummy products and 120 generated orders
│
└── client/                      ← VUE 3 APP
    ├── index.html               ← the single HTML page (viewport meta for mobile)
    ├── vite.config.js           ← Vue plugin, Tableau custom element, /graphql proxy
    ├── .env.example             ← VITE_GRAPHQL_URL, VITE_TABLEAU_URL
    └── src/
        ├── main.js              ← createApp + Pinia + Router
        ├── App.vue              ← app shell: top bar, sidebar, <RouterView>
        │
        ├── router/index.js      ← routes, lazy-loaded pages, page titles
        ├── stores/filters.js    ← Pinia store (selected region, shared across pages)
        │
        ├── graphql/
        │   ├── client.js        ← gqlRequest(): fetch-based GraphQL client
        │   └── queries.js       ← all queries, a fragment, and a mutation
        │
        ├── composables/
        │   ├── useQuery.js      ← reactive data/loading/error, re-runs on variable change
        │   └── useMutation.js   ← mutate() with loading/error
        │
        ├── components/
        │   ├── layout/
        │   │   ├── AppTopBar.vue    ← phone-only header with menu button
        │   │   └── AppSidebar.vue   ← fixed sidebar on desktop, slide-in drawer on phones
        │   ├── KpiCard.vue          ← stat tile
        │   ├── MonthlyChart.vue     ← bar chart in pure HTML/CSS
        │   ├── RegionBreakdown.vue  ← clickable region bars (emits "select")
        │   ├── RecentOrders.vue
        │   ├── OrderStatusBadge.vue
        │   ├── ProductTable.vue     ← table on desktop, cards on phones
        │   ├── StatusMessage.vue    ← loading / error / empty states + <slot>
        │   └── TableauEmbed.vue     ← Tableau Embedding API v3 wrapper
        │
        ├── views/                   ← one file per page (route)
        │   ├── DashboardView.vue    ← KPIs, charts, region filter, recent orders
        │   ├── ProductsView.vue     ← search (debounced) + category filter, synced to URL
        │   ├── ProductDetailView.vue← nested GraphQL data + stock update mutation
        │   └── AnalyticsView.vue    ← embedded Tableau dashboard
        │
        ├── utils/format.js          ← currency/date formatting with Intl
        └── assets/main.css          ← design tokens, dark mode, reset, shared classes
```

---

## 3. Where each job requirement lives

| Requirement | Where to look | What to say in an interview |
|---|---|---|
| **a) Responsive layouts** | `assets/main.css` (`.grid-auto`, `.grid-2`), `AppSidebar.vue`, `ProductTable.vue` | Mobile-first CSS. `repeat(auto-fit, minmax(220px, 1fr))` makes grids adapt without media queries. The sidebar becomes a drawer below 900px. The table turns into cards on phones using `data-label` and `::before`. |
| **b) Cross-browser / device** | `index.html`, `main.css` | Viewport meta tag; system font stack; box-sizing reset; 16px inputs so iOS Safari doesn't zoom; 40px touch targets; `-webkit-text-size-adjust`; `prefers-color-scheme` and `prefers-reduced-motion`. Test in Chrome, Safari, Firefox, Edge, and DevTools device mode. |
| **c) Implementing designs** | `main.css` `:root` tokens, `components/` | Colors, spacing and type are CSS variables (design tokens), so matching a Figma file means changing values in one place. The UI is split into small reusable components. |
| **d) Vue 3** | everything in `client/src` | `<script setup>`, `ref`, `computed`, `watch`, props/emits, slots, `defineExpose`, template refs, composables, Pinia, Vue Router with lazy loading and route props. |
| **d) Tableau** | `TableauEmbed.vue`, `vite.config.js` | Load the Embedding API v3 script once, render `<tableau-viz>`, listen for `firstinteractive`. Vue is told `tableau-*` tags are custom elements (`isCustomElement`). |
| **e) GraphQL** | `server/schema.js`, `graphql/`, `composables/` | One endpoint, POST with `query` + `variables`; the client requests only the fields it needs; fragments for reuse; nested data (`product { orders { ... } }`) in one request; a mutation; checking the `errors` array because GraphQL usually returns HTTP 200. |

---

## 4. Things to try in GraphiQL (http://localhost:4000/graphql)

**A query with variables**
```graphql
query ($region: String) {
  dashboard(region: $region) {
    totalRevenue
    totalOrders
    salesByRegion { region revenue }
  }
}
```
Variables panel: `{ "region": "East" }`

**Nested data in one request** (in REST this would usually be two or more requests)
```graphql
{
  product(id: "3") {
    name
    totalRevenue
    orders(limit: 3) { id customer total }
  }
}
```

**A mutation**
```graphql
mutation {
  updateStock(id: "8", stock: 30) { name stock lowStock }
}
```

**An error** (see how GraphQL reports it)
```graphql
mutation {
  updateStock(id: "999", stock: 5) { name }
}
```

Tip: press **Ctrl + Space** in GraphiQL for autocomplete, and open the **Docs** panel to browse the schema.

---

## 5. How a page gets its data (follow the flow)

Using `DashboardView.vue` as the example:

1. The page calls `useQuery(DASHBOARD_QUERY, () => ({ region: region.value || null }))`.
2. `useQuery` (in `composables/`) calls `gqlRequest()` and stores the result in `data`, and sets `loading` and `error` along the way.
3. `gqlRequest()` (in `graphql/client.js`) POSTs `{ query, variables }` to `/graphql`.
4. Vite's dev proxy forwards `/graphql` to `http://localhost:4000/graphql`.
5. GraphQL Yoga runs the resolvers in `server/schema.js` against `server/data.js`.
6. The JSON response comes back, `data` updates, and the template re-renders.
7. When you pick another region, the Pinia store changes, the variables function returns a new value, `watch` notices, and the query runs again.

---

## 6. About the GraphQL client

This project uses a small fetch-based client (`graphql/client.js`) so you can see exactly how GraphQL works over HTTP. Many companies use **Apollo Client** instead, which adds caching. The Vue version looks very similar to `useQuery` here:

```js
// npm install @apollo/client @vue/apollo-composable graphql
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const { result, loading, error, refetch } = useQuery(
  gql`query ($id: ID!) { product(id: $id) { name stock } }`,
  () => ({ id: props.id })
)
```

If the job uses Apollo, the ideas (query, variables, loading/error, refetch) are the same.

---

## 7 Roadmap

Planned improvements. Checked items are done.

### GraphQL API
- [ ] Add a `description` field to products and show it on the product page
- [ ] Add a `topCustomers` query with a matching dashboard card
- [ ] Add a `createProduct` mutation with an input type and a form

### UI and UX
- [ ] Sortable product table (price, stock)
- [ ] Two-column KPI cards on phones

### State management
- [ ] Keep product search and category filters in Pinia across pages

### Tableau
- [ ] Add a filter control using the Embedding API's `applyFilterAsync`

### Quality
- [ ] Cross-browser testing on Safari, Chrome, Firefox and Edge
- [ ] Responsive testing on phone and tablet sizes

---


