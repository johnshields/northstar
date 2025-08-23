const express = require('express');
const router = express.Router();

const {
    fetchOrders,
    syncOrders,
    gmvSummary,
    getMerchants,
    getOrders,
} = require('./routes/routes');

router.get('/shopify-fetch', fetchOrders);
router.get('/shopify-sync', syncOrders);
router.get('/gmv-summary', gmvSummary);
router.get('/merchants', getMerchants);
router.get('/orders', getOrders);

module.exports = router;
