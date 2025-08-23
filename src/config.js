require('dotenv').config();

module.exports = {
    // Core server config
    NAME: 'northstar_api',
    HOST: process.env.IP || '127.0.0.1',
    PORT: Number(process.env.PORT) || 8080,
    VERSION: process.env.VERSION || '0.0.1',
    API_VERSION: process.env.API_VERSION || 'v1',

    // Shopify config
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    SHOPIFY_SHOP: process.env.SHOPIFY_SHOP,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,

    // Supabase config
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
};
