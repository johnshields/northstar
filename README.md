# northstar

Microservice for calculating GMV and syncing Shopify order data using **Node.js**, **Express**, **Supabase**, and the **Shopify Admin GraphQL API**.

## Development Environment

- Node.js / Express
- Supabase (PostgreSQL)
- Shopify Admin API (GraphQL)

---

## How to Run

### Requirements

- [Git](https://git-scm.com/downloads)
- [Supabase](https://supabase.com/)
- [Node.js & NPM](https://nodejs.org/)
- [Shopify Partner Account](https://partners.shopify.com/)

### Setup & Run

#### Create a .env file:

```
# supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# shopify
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_ACCESS_TOKEN=your_shopify_admin_access_token
SHOPIFY_SHOP=your-shop-name

# api
PORT=8080
```

#### SQL script located here [sql/schema.sql](sql/schema.sql)

#### Open a directory in Command-Line and enter:
```bash
$ git clone https://github.com/johnshields/northstar.git
$ cd northstar/
$ npm install
$ node src/server.js
```

* The API will listen on: http://localhost:8080/

## Endpoints

### `GET /api/merchants`  
Returns all merchants from the Supabase `ns_merchants` table.

### `GET /api/orders`  
Returns all orders from the Supabase `ns_orders` table.

### `GET /api/gmv-summary`  
Returns total GMV across all merchants and AOV/total orders per merchant.

### `GET /api/shopify-fetch`  
Queries the Shopify Admin GraphQL API to fetch live order-level sales data for the configured merchant.

***
