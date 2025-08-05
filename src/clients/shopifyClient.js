const { shopifyApi, LATEST_API_VERSION, LogSeverity } = require('@shopify/shopify-api');
require('dotenv').config();
require('@shopify/shopify-api/adapters/node');

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    hostName: process.env.SHOPIFY_SHOP,
    adminApiAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    isCustomStoreApp: true,
    apiVersion: LATEST_API_VERSION,
    logger: {
        level: LogSeverity.Error
    }
});

module.exports = shopify;
