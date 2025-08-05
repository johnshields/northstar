const cron = require('node-cron');
const { shopifyFetcher } = require('./services/apiService');

cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Scheduled Task: Fetching latest orders from Shopify...`);
    const orders = await shopifyFetcher();
    console.log(`Fetched ${orders.length} orders from Shopify.`);
});