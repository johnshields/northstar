const {
    createMerchant,
    updateMerchantByUID,
    deleteMerchantByUID,
    calculateGMV,
    listMerchants,
    listMerchantOrders
} = require('../controllers/merchantController');

const { handleError } = require('../../utils/utils');

/**
 * POST /api/merchants
 * Creates a new merchant.
 */
exports.postMerchant = async (req, res) => {
    try {
        const merchant = await createMerchant(req.body);
        return res.status(201).json(merchant);
    } catch (error) {
        console.error('Error creating merchant:', error.message);
        return handleError(res, 500, 'Failed to create merchant.');
    }
};

/**
 * PUT /api/merchants/:uid
 * Updates merchant by UID.
 */
exports.putMerchant = async (req, res) => {
    try {
        const merchant = await updateMerchantByUID(req.params.uid, req.body);
        if (!merchant) {
            return res.status(404).json({ error: 'Merchant not found.' });
        }
        return res.status(200).json(merchant);
    } catch (error) {
        console.error('Error updating merchant:', error.message);
        return handleError(res, 500, 'Failed to update merchant.');
    }
};

/**
 * DELETE /api/merchants/:uid
 * Deletes merchant by UID.
 */
exports.deleteMerchant = async (req, res) => {
    try {
        const merchant = await deleteMerchantByUID(req.params.uid);
        if (!merchant) {
            return res.status(404).json({ error: 'Merchant not found.' });
        }
        return res.status(200).json({ message: 'Merchant deleted successfully.', merchant });
    } catch (error) {
        console.error('Error deleting merchant:', error.message);
        return handleError(res, 500, 'Failed to delete merchant.');
    }
};

/**
 * GET /api/merchants OR GET /api/merchants?uid=MERCHANT_XXXXXX
 * Returns all merchants or a single merchant by UID.
 */
exports.getMerchants = async (req, res) => {
    try {
        const { uid } = req.query;
        const merchants = await listMerchants(uid);

        if (uid && !merchants) {
            return res.status(404).json({ error: 'Merchant not found.' });
        }

        return res.status(200).json(merchants || []);
    } catch (error) {
        console.error('Error fetching merchants:', error.message);
        return handleError(res, 500, 'Failed to fetch merchants.');
    }
};

/**
 * GET /api/gmv-summary
 * Returns GMV summary:
 * - GMV, AOV, total orders per merchant
 * - Total GMV across all merchants
 */
exports.getGMVSummary = async (req, res) => {
    try {
        const orders = await listMerchantOrders();
        const { total_gmv, merchants } = calculateGMV(orders);

        res.json({
            timestamp: new Date().toISOString(),
            total_gmv,
            merchants
        });
    } catch (err) {
        console.error('GMV summary error:', err);
        return handleError(res, 500, 'Could not generate GMV summary');
    }
};
