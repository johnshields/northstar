const express = require('express');
const router = express.Router();

const {
    fetchShopifyOrders,
    getShopifySync,
    getOrders,
    postOrder,
    putOrder,
    deleteOrder,
} = require('./routes/orders');

const {
    getMerchants,
    getGMVSummary,
    postMerchant,
    putMerchant,
    deleteMerchant,
} = require('./routes/merchants');

// merchants
router.get('/gmv-summary', getGMVSummary);
router.get('/merchants', getMerchants);
router.post('/merchants', postMerchant);
router.put('/merchants/:uid', putMerchant);
router.delete('/merchants/:uid', deleteMerchant);

// orders
router.get('/orders', getOrders);
router.post('/orders', postOrder);
router.put('/orders/:uid', putOrder);
router.delete('/orders/:uid', deleteOrder);

// shopify
router.get('/shopify-fetch', fetchShopifyOrders);
router.get('/shopify-sync', getShopifySync);

// Fallback for any other /api/* routes
router.use((req, res) => {
    res.status(404).json({error: 'API route not found.', path: req.originalUrl, method: req.method});
});

module.exports = router;
