const { shopifyApi, LATEST_API_VERSION, LogSeverity } = require('@shopify/shopify-api');
require('@shopify/shopify-api/adapters/node');

const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_SHOP,
    SHOPIFY_ACCESS_TOKEN
} = require('../../config');

const shopify = shopifyApi({
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    hostName: SHOPIFY_SHOP,
    adminApiAccessToken: SHOPIFY_ACCESS_TOKEN,
    isCustomStoreApp: true,
    apiVersion: LATEST_API_VERSION,
    logger: { level: LogSeverity.Error },
});

module.exports = shopify;
