const cron = require('node-cron');
const {shopifyFetcher, syncShopifyOrders} = require('./services/apiService');

cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Scheduled Task: Fetching latest orders from Shopify...`);
    const orders = await shopifyFetcher();
    console.log(`Fetched ${orders.length} orders from Shopify.`);
});

cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Scheduled Task: Syncing Shopify orders to Supabase...`);
    await syncShopifyOrders();
});
