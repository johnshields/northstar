const supabase = require('../clients/supabaseClient');

const {
    shopifyFetcher,
    syncShopifyOrders,
    getOrdersFromDB,
    calculateGMV
} = require('../services/apiService');

const handleError = (res, status, message) => {
    console.error(message);
    return res.status(status).json({error: message});
};

/**
 * GET /api/shopify-fetch
 * Fetches order-level sales data for a merchant from Shopify.
 */
exports.fetchOrders = async (req, res) => {
    try {
        const data = await shopifyFetcher();
        return res.json(data);
    } catch (err) {
        handleError(res, 500, 'Failed to fetch orders from Shopify');
    }
};

/**
 * GET /api/shopify-sync
 * Fetches latest Shopify orders to sync Supabase.
 */
exports.syncOrders = async (req, res) => {
    try {
        await syncShopifyOrders();
        res.status(200).json({message: 'Shopify orders synced successfully.'});
    } catch (error) {
        console.error('Error syncing Shopify orders:', error.message);
        res.status(500).json({error: 'Failed to sync Shopify orders.'});
    }
};

/**
 * GET /api/gmv-summary
 * Returns GMV summary:
 * - GMV, AOV, total orders per merchant
 * - Total GMV across all merchants
 */
exports.gmvSummary = async (req, res) => {
    try {
        const orders = await getOrdersFromDB();
        const {total_gmv, merchants} = calculateGMV(orders);

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

    if (error) {
        return handleError(res, 500, error.message);
    }

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

    if (error) {
        return handleError(res, 500, error.message);
    }

    return res.json(data);
};
