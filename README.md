# northstar

API for calculating GMV and simulating Shopify order data using **Node.js**, **Express**, and **Supabase**.

## Development Environment

- Node.js / Express
- Supabase (PostgreSQL)

---

## How to Run

### Requirements

- [Git](https://git-scm.com/downloads)
- [Supabase](https://supabase.com/)
- [Node.js & NPM](https://nodejs.org/)

### Setup & Run

#### Create a .env file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

#### SQL script located here [sql/schema.sql](sql/schema.sql)

#### Open a directory in Command-Line and enter:
```bash
$ git clone https://github.com/johnshields/northstar.git
$ cd northstar/
$ npm install
$ npm run dev
```

* The API will listen on: http://localhost:8080/

## Endpoints

### `GET /api/merchants`  
Returns all merchants from the Supabase `ns_merchants` table.

### `GET /api/orders`  
Returns all orders from the Supabase `ns_orders` table.

### `GET /api/gmv-summary`  
Calculates GMV and AOV per merchant and returns total GMV.

### `GET /api/shopify-fetch`  
Simulates a Shopify Admin GraphQL API call for a single merchant using database order data.

***
