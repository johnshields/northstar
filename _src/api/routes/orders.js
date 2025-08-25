const {
    createOrder,
    updateOrderByUID,
    deleteOrderByUID,
    listOrders,
    shopifyFetcher,
    syncShopifyOrders
} = require('../controllers/orderController');

const {handleError} = require("../../utils/utils");

/**
 * POST /api/orders
 * Creates a new order.
 */
exports.postOrder = async (req, res) => {
    try {
        const order = await createOrder(req.body);
        return res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error.message);
        return handleError(res, 500, 'Failed to create order.');
    }
};

/**
 * PUT /api/orders/:uid
 * Updates order by UID.
 */
exports.putOrder = async (req, res) => {
    try {
        const order = await updateOrderByUID(req.params.uid, req.body);
        if (!order) {
            return res.status(404).json({error: 'Order not found.'});
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order:', error.message);
        return handleError(res, 500, 'Failed to update order.');
    }
};

/**
 * DELETE /api/orders/:uid
 * Deletes order by UID.
 */
exports.deleteOrder = async (req, res) => {
    try {
        const order = await deleteOrderByUID(req.params.uid);
        if (!order) {
            return res.status(404).json({error: 'Order not found.'});
        }
        return res.status(200).json({message: 'Order deleted successfully.', order});
    } catch (error) {
        console.error('Error deleting order:', error.message);
        return handleError(res, 500, 'Failed to delete order.');
    }
};

/**
 * GET /api/orders OR GET /api/orders?uid=ORDER_XXXXXX
 * Returns all orders or single order by UID.
 */
exports.getOrders = async (req, res) => {
    try {
        const {uid} = req.query;
        const orders = await listOrders(uid);

        if (uid && !orders) {
            return res.status(404).json({error: 'Order not found.'});
        }

        return res.status(200).json(orders || []);
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
        return handleError(res, 500, 'Failed to fetch orders from Shopify.');
    }
};

/**
 * GET /api/shopify-sync
 * Fetches latest Shopify orders to sync database.
 */
exports.getShopifySync = async (req, res) => {
    try {
        await syncShopifyOrders();
        return res.status(200).json({message: 'Shopify orders synced successfully.'});
    } catch (error) {
        console.error('Error syncing Shopify orders:', error.message);
        return handleError(res, 500, 'Failed to sync Shopify orders.');
    }
};
