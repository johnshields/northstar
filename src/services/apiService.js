const supabase = require('../db/supabaseClient');

/**
 * Fetch Shopify-style orders for a given merchant from Supabase.
 * The response mimics Shopify's GraphQL orders query format.
 */
const shopifyFetcher = async (merchant) => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select('id, created_at, total_price')
        .eq('merchant_id', merchant.id);

    if (error) throw new Error(error.message);

    const edges = data.map((order, index) => ({
        cursor: `cursor_${index + 1}`,
        node: {
            id: `gid://shopify/Order/${order.id}`,
            createdAt: order.created_at,
            totalPrice: order.total_price
        }
    }));

    return {
        edges,
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: edges[0]?.cursor || null,
            endCursor: edges.at(-1)?.cursor || null
        }
    };
};

const getOrdersFromDB = async () => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select(`id, total_price, ns_merchants (id, name)`);

    if (error) throw new Error(error.message);
    return data;
};

/**
 * Takes an array of orders (with merchant info) and returns:
 * - Total GMV across all merchants
 * - A list of merchants with their GMV, total orders, and AOV
 */
const calculateGMVSummary = (orders) => {
    const merchantTotals = {};
    let totalGMV = 0;

    for (const {total_price, ns_merchants: merchant} of orders) {
        // Ignore if merchant join is missing
        if (!merchant) continue;

        const {id, name} = merchant;
        const price = parseFloat(total_price);

        // Initialise if this merchant hasn't been seen yet
        if (!merchantTotals[id]) {
            merchantTotals[id] = {id, name, gmv: 0, total_orders: 0};
        }

        // Update this merchant's stats
        merchantTotals[id].gmv += price;
        merchantTotals[id].total_orders += 1;

        // Track total GMV
        totalGMV += price;
    }

    // Calculate AOV for each merchant
    const merchants = Object.values(merchantTotals).map(merchant => ({
        ...merchant, aov: parseFloat((merchant.gmv / merchant.total_orders).toFixed(2))
    }));

    return {
        total_gmv: parseFloat(totalGMV.toFixed(2)),
        merchants
    };
};

module.exports = {
    getOrdersFromDB,
    calculateGMVSummary,
    shopifyFetcher
};
