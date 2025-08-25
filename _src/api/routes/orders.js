const {shopifyFetcher, syncShopifyOrders, listOrders} = require('../controllers/orderController');
const {handleError} = require("../../utils/utils");

/**
 * GET /api/orders
 * Returns a list of orders from database.
 */
exports.getOrders = async (req, res) => {
    try {
        const orders = await listOrders();
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        return handleError(res, 500, 'Failed to fetch orders.');
    }
};

/**
 * GET /api/shopify-fetch
 * Fetches order-level sales data for a merchant from Shopify.
 */
exports.fetchShopifyOrders = async (req, res) => {
    try {
        const data = await shopifyFetcher();
        return res.json(data);
    } catch (err) {
        console.error('Error fetching Shopify orders:', err.message);
        handleError(res, 500, 'Failed to fetch orders from Shopify.');
    }
};

/**
 * GET /api/shopify-sync
 * Fetches latest Shopify orders to sync database.
 */
exports.getShopifySync = async (req, res) => {
    try {
        await syncShopifyOrders();
        res.status(200).json({message: 'Shopify orders synced successfully.'});
    } catch (error) {
        console.error('Error syncing Shopify orders:', error.message);
        handleError(res, 500, 'Failed to sync Shopify orders.');
    }
};