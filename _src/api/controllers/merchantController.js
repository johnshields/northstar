const supabase = require('../clients/supabaseClient');

// Retrieves all orders from database.
const listMerchants = async () => {
    const {data, error} = await supabase
        .from('ns_merchants')
        .select('*')
        .order('created_at', {ascending: true});

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

/**
 * Calculates GMV summary for a set of database orders.
 * Returns: Total GMV, Per-merchant GMV, order count, and AOV
 */
const calculateGMV = (orders) => {
    const merchantStats = {};
    let totalGMV = 0;

    for (const {total_price, ns_merchants: merchant} of orders) {
        // Skip if merchant relation is missing
        if (!merchant) continue;

        const {uid, name} = merchant;
        const price = parseFloat(total_price);

        // Init merchant record if first time seen
        if (!merchantStats[uid]) {
            merchantStats[uid] = {uid, name, gmv: 0, total_orders: 0};
        }

        merchantStats[uid].gmv += price;
        merchantStats[uid].total_orders += 1;
        totalGMV += price;
    }

    // Format final summary per merchant
    const merchants = Object.values(merchantStats).map(({uid, name, gmv, total_orders}) => ({
        uid,
        name,
        gmv: parseFloat(gmv.toFixed(2)),
        total_orders,
        aov: parseFloat((gmv / total_orders).toFixed(2)),
    }));

    return {
        total_gmv: parseFloat(totalGMV.toFixed(2)),
        merchants,
    };
};

/**
 * Fetches all orders from database with merchant info.
 */
const listMerchantOrders = async () => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select(`
            uid, 
            total_price, 
            ns_merchants!ns_orders_merchant_uid_fkey (uid, name)
        `);

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data;
};

module.exports = {
    listMerchants,
    calculateGMV,
    listMerchantOrders,
};