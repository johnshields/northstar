const express = require('express');
const router = express.Router();

const {
    getGMVSummary,
    getMerchants,
} = require('./routes/merchants');

const {
    fetchShopifyOrders,
    getShopifySync,
    getOrders,
} = require('./routes/orders');

router.get('/shopify-fetch', fetchShopifyOrders);
router.get('/shopify-sync', getShopifySync);
router.get('/gmv-summary', getGMVSummary);
router.get('/merchants', getMerchants);
router.get('/orders', getOrders);

module.exports = router;
