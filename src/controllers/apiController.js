const supabase = require('../db/supabaseClient');
const {shopifyFetcher} = require('../services/shopifyService');
const {getOrdersFromDB, calculateGMVSummary} = require('../services/supabaseService');

// Centralised error handler for consistent error responses
const handleError = (res, status, message) => {
    return res.status(status).json({error: message});
};

/**
 * GET /api/shopify-fetch
 * Fetches Shopify order-level sales data for a single merchant
 */
exports.shopifyFetch = async (req, res) => {
    try {
        // Retrieve a single merchant from the database
        const {data: merchant, error} = await supabase
            .from('ns_merchants')
            .select('*')
            .limit(1)
            .single();

        if (error || !merchant) {
            return handleError(res, 404, 'No merchant found in database');
        }

        // Fetch Shopify order data for the merchant
        const orders = await shopifyFetcher(merchant);

        // Return merchant name + fetched order data
        res.json({
            merchant: merchant.name,
            orders
        });

    } catch (err) {
        console.error('Shopify fetch failed:', err);
        return handleError(res, 500, 'Internal server error');
    }
};

/**
 * GET /api/gmv-summary
 * Returns GMV (Gross Merchandise Value) summary including:
 *  - Each merchant’s GMV, AOV (Average Order Value), and total orders
 *  - Total GMV across all merchants
 */
exports.gmvSummary = async (req, res) => {
    try {
        // Pull order data from Supabase
        const orders = await getOrdersFromDB();

        // Calculate GMV summary stats
        const {total_gmv, merchants} = calculateGMVSummary(orders);

        // Return structured summary with timestamp
        res.json({
            timestamp: new Date().toISOString(),
            total_gmv,
            merchants
        });

    } catch (err) {
        console.error('GMV summary error:', err);
        handleError(res, 500, 'Could not generate GMV summary');
    }
};

/**
 * GET /api/merchants
 * Returns all merchants from the database (for testing/dev purposes)
 */
exports.getMerchants = async (req, res) => {
    const {data, error} = await supabase
        .from('ns_merchants')
        .select('*')
        .order('created_at', {ascending: true});

    if (error) {
        return handleError(res, 500, error.message);
    }

    return res.json(data);
};

/**
 * GET /api/orders
 * Returns all orders from the database (for testing/dev purposes)
 */
exports.getOrders = async (req, res) => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select('*')
        .order('created_at', {ascending: true});

    if (error) {
        return handleError(res, 500, error.message);
    }

    return res.json(data);
};
