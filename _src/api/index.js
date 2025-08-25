const express = require('express');
const router = express.Router();

const {
    postOrder, putOrder, deleteOrder, getOrders,
    fetchShopifyOrders, getShopifySync
} = require('./routes/orders');

const {
    postMerchant, putMerchant, deleteMerchant,
    getMerchants, getGMVSummary
} = require('./routes/merchants');

// merchants
router.post('/merchants', postMerchant);
router.put('/merchants/:uid', putMerchant);
router.delete('/merchants/:uid', deleteMerchant);
router.get('/merchants', getMerchants);
router.get('/gmv-summary', getGMVSummary);

// orders
router.post('/orders', postOrder);
router.put('/orders/:uid', putOrder);
router.delete('/orders/:uid', deleteOrder);
router.get('/orders', getOrders);

// shopify
router.get('/shopify-fetch', fetchShopifyOrders);
router.get('/shopify-sync', getShopifySync);

// Fallback for any other /api/* routes
router.use((req, res) => {
    res.status(404).json({error: 'API route not found.', path: req.originalUrl, method: req.method});
});

module.exports = router;
