const express = require('express');
const router = express.Router();

const {
    getMerchants,
    getGMVSummary
} = require('./routes/merchants');

const {
    getOrders,
    postOrder,
    putOrder,
    deleteOrder,
    fetchShopifyOrders,
    getShopifySync
} = require('./routes/orders');

// merchants
router.get('/merchants', getMerchants);
router.get('/gmv-summary', getGMVSummary);

// orders
router.post('/orders', postOrder);
router.put('/orders/:uid', putOrder);
router.delete('/orders/:uid', deleteOrder);
router.get('/orders', getOrders);
router.get('orders/:uid', getOrders);
router.get('/shopify-fetch', fetchShopifyOrders);
router.get('/shopify-sync', getShopifySync);

module.exports = router;
