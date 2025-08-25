# northstar 🌠

Microservice with Shopify Admin API and Supabase (PostgreSQL) integration using **Node.js** and **Express**.

### Requirements

- [Git](https://git-scm.com/downloads)
- [Supabase](https://supabase.com/)
- [Node.js & NPM](https://nodejs.org/)
- [Shopify Partner Account](https://partners.shopify.com/)

## Run service

```bash
$ git clone https://github.com/johnshields/northstar.git
$ cd northstar/
$ npm install
$ node _src/server.js
```

#### .env example:

```dotenv
# supabase
SUPABASE_URL=supabase_url
SUPABASE_KEY=anon_key

# shopify
SHOPIFY_API_KEY=shopify_api_key
SHOPIFY_API_SECRET=shopify_api_secret
SHOPIFY_ACCESS_TOKEN=shopify_access_token
SHOPIFY_SHOP=shop-name

# api
PORT=8080
IP=127.0.0.1
```

#### SQL script located here [sql/schema.sql](sql/schema.sql)

## Scheduler
Two background cron jobs are configured with [`node-cron`](https://www.npmjs.com/package/node-cron) to keep Shopify data fresh:

- **Every hour (on the hour):**
    - `shopifyFetcher()` is executed to fetch the latest orders from Shopify and log the count retrieved.
    - `syncShopifyOrders()` is executed to sync any new Shopify orders into the Supabase database.

This ensures the system always has up-to-date sales data without requiring manual API calls.

## Endpoints

### Merchants
- **`GET /api/gmv-summary`**  
  Returns GMV (Gross Merchandise Value) summary across all merchants:
    - Total GMV
    - AOV (Average Order Value) per merchant
    - Total orders per merchant

- **`GET /api/merchants`**  
  Returns all merchants from the Supabase `ns_merchants` table, or a single merchant if `?uid=MERCHANT_XXXXXX` is provided.

- **`POST /api/merchants`**  
  Creates a new merchant in the `ns_merchants` table.

- **`PUT /api/merchants/:uid`**  
  Updates an existing merchant by UID.

- **`DELETE /api/merchants/:uid`**  
  Deletes a merchant by UID.
---

### Orders
- **`GET /api/shopify-fetch`**  
  Queries the Shopify Admin GraphQL API to fetch live order-level sales data for the configured merchant (does not persist to DB).

- **`GET /api/shopify-sync`**  
  Fetches live order-level sales data from Shopify and inserts new orders into the Supabase database.

- **`GET /api/orders`**  
  Returns all orders from the Supabase `ns_orders` table, or a single order if `?uid=ORDER_XXXXXX` is provided.

- **`POST /api/orders`**  
  Creates a new order in the `ns_orders` table.

- **`PUT /api/orders/:uid`**  
  Updates an existing order by UID.

- **`DELETE /api/orders/:uid`**  
  Deletes an order by UID.
***
