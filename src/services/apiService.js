const shopify = require('../clients/shopifyClient');
const supabase = require('../clients/supabaseClient');
require('@shopify/shopify-api/adapters/node');


/**
 * Fetch Shopify orders.
 */
const shopifyFetcher = async () => {
    const session = {
        shop: process.env.SHOPIFY_SHOP,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN
    };

    const client = new shopify.clients.Graphql({session});

    const response = await client.query({
        data: `query {
      orders(first: 10) {
        edges {
          cursor
          node {
            id
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`
    });

    return response.body.data.orders;
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
