const supabase = require('../clients/supabaseClient');

const {
    shopifyFetcher,
    getOrdersFromDB,
    calculateGMVSummary
} = require('../services/apiService');

const handleError = (res, status, message) => {
    console.error(message);
    return res.status(status).json({error: message});
};

/**
 * GET /api/shopify-fetch
 * Fetches order-level sales data for a merchant from Shopify.
 */
exports.getShopifyOrders = async (req, res) => {
    try {
        const data = await shopifyFetcher();
        return res.json(data);
    } catch (err) {
        handleError(res, 500, 'Failed to fetch orders from Shopify');
    }
};

/**
 * GET /api/gmv-summary
 * Returns GMV summary:
 *  - GMV, AOV, total orders per merchant
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
 * Returns all merchants from Supabase (for dev/testing).
 */
exports.getMerchants = async (req, res) => {
    const {data, error} = await supabase
        .from('ns_merchants')
        .select('*')
        .order('created_at', {ascending: true});

    if (error) return handleError(res, 500, error.message);
    return res.json(data);
};

/**
 * GET /api/orders
 * Returns all orders from Supabase (for dev/testing).
 */
exports.getOrders = async (req, res) => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select('*')
        .order('created_at', {ascending: true});

    if (error) return handleError(res, 500, error.message);
    return res.json(data);
};
