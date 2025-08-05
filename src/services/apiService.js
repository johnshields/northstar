const shopify = require('../clients/shopifyClient');
const supabase = require('../clients/supabaseClient');

/**
 * Fetches Shopify order-level sales data for a single merchant.
 * Returns: [{ id, name, createdAt, totalPrice }]
 */
const shopifyFetcher = async () => {
    const session = {
        shop: process.env.SHOPIFY_SHOP,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    };

    const client = new shopify.clients.Graphql({session});

    const query = `query {
        orders(first: 10) {
          edges {
            node {
              id
              name
              createdAt
              totalPrice
            }
          }
        }
    }`;

    const response = await client.query({data: query});

    return response.body?.data?.orders?.edges.map(edge => edge.node) || [];
};

/**
 * Calculates GMV summary for a set of Supabase orders.
 * Returns:
 * - Total GMV
 * - Per-merchant GMV, order count, and AOV
 */
const calculateGMVSummary = (orders) => {
    const merchantStats = {};
    let totalGMV = 0;

    for (const {total_price, ns_merchants: merchant} of orders) {
        if (!merchant) continue;

        const {id, name} = merchant;
        const price = parseFloat(total_price);

        if (!merchantStats[id]) {
            merchantStats[id] = {id, name, gmv: 0, total_orders: 0};
        }

        merchantStats[id].gmv += price;
        merchantStats[id].total_orders += 1;
        totalGMV += price;
    }

    const merchants = Object.values(merchantStats).map(({id, name, gmv, total_orders}) => ({
        id,
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
 * Fetches all orders from Supabase with merchant info.
 */
const getOrdersFromDB = async () => {
    const {data, error} = await supabase
        .from('ns_orders')
        .select('id, total_price, ns_merchants (id, name)');

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data;
};

module.exports = {
    shopifyFetcher,
    calculateGMVSummary,
    getOrdersFromDB
};
