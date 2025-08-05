const express = require('express');
const router = express.Router();

const {
    shopifyFetch,
    gmvSummary,
    getMerchants,
    getOrders,
} = require('../controllers/apiController');

router.get('/shopify-fetch', shopifyFetch);
router.get('/gmv-summary', gmvSummary);
router.get('/merchants', getMerchants);
router.get('/orders', getOrders);

module.exports = router;
