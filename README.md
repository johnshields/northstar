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
$ node src/server.js
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
```

#### SQL script located here [sql/schema.sql](sql/schema.sql)

## Endpoints

### `GET /api/merchants`  
Returns all merchants from the Supabase `ns_merchants` table.

### `GET /api/orders`  
Returns all orders from the Supabase `ns_orders` table.

### `GET /api/shopify-fetch`  
Queries the Shopify Admin GraphQL API to fetch live order-level sales data for the configured merchant.

### `GET /api/shopify-sync`
Fetches live order-level sales data from the Shopify Admin GraphQL API and inserts new orders into the Supabase database.

### `GET /api/gmv-summary`
Returns total GMV across all merchants and AOV/total orders per merchant.

***
