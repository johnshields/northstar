const express = require('express');
const router = express.Router();

const {
    getShopifyOrders,
    gmvSummary,
    getMerchants,
    getOrders,
} = require('../controllers/apiController');

router.get('/shopify-fetch', getShopifyOrders);
router.get('/gmv-summary', gmvSummary);
router.get('/merchants', getMerchants);
router.get('/orders', getOrders);

module.exports = router;
