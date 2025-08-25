const {calculateGMV, listMerchantOrders, listMerchants} = require('../controllers/merchantController');
const {handleError} = require('../../utils/utils');

/**
 * GET /api/merchants
 * Returns all merchants from database.
 */
exports.getMerchants = async (req, res) => {
    try {
        const merchants = await listMerchants();
        return res.status(200).json(merchants);
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
        const {total_gmv, merchants} = calculateGMV(orders);

        res.json({
            timestamp: new Date().toISOString(),
            total_gmv,
            merchants
        });
    } catch (err) {
        console.error('GMV summary error:', err);
        handleError(res, 500, 'Could not generate GMV summary');
    }
};