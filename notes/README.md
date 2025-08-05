# Notes

This README outlines the internal structure, database schema, and future improvement areas.

---

## API Architecture

![API Structure](./northstar_proj-Page-1.drawio.png)

## Supabase DB Schema

![Supabase DB Structure](./northstar_proj-Page-2.drawio.png)

---

## Observations & Limitations

This microservice has a clear separation of concerns, with each part of the architecture handling a distinct responsibility. 
The `server.js` file sets up the Express server and loads the necessary routes and the scheduler. 
All HTTP API routes are defined in `routes.js`, which delegate logic to `apiController.js`. 
The controller calls into `apiService.js`, which coordinates between the Shopify and Supabase clients.

The architecture is modular and scalable - making it easy to add new endpoints or update logic independently. 
The `shopifyClient.js` file handles communication with the Shopify Admin GraphQL API, 
while `supabaseClient.js` deals with reading/writing to the Supabase database. 
A dedicated `scheduler.js` file uses node-cron to automatically fetch and sync Shopify orders every hour, keeping data fresh with minimal manual input.

Finally, the Supabase schema is well structured, cleanly mirroring Shopify order data and 
supporting efficient querying for GMV summaries and order insights.

---

## Future Improvements

- **Performance**: Use `cursor-based pagination` with Shopify GraphQL API to avoid hitting query limits as data grows.
- **Error Handling**: Introduce centralised logging and better error propagation to support alerting/monitoring.
- **Deduplication**: Ensure fetched orders are checked for duplicates before inserting to Supabase.
- **Auth**: Lock down `/api` routes with API keys or JWT in production.
- **Testing**: Add unit tests for each service layer (`shopifyClient`, `apiService`, etc.).
- **Scaling**: Containerize the service (e.g. Docker) and deploy on a serverless platform (e.g., Fly.io, Railway) for production.
- **CI/CD**: Add GitHub Actions to lint, test, and deploy on push to `main`.

---

