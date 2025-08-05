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
}

/**
 * Fetches latest Shopify orders and inserts them into DB.
 */
const syncShopifyOrders = async () => {
    const orders = await shopifyFetcher();

    for (const order of orders) {
        const {id, name, createdAt, totalPrice} = order;

        // Skip if order already exists
        const {data: existing} = await supabase
            .from('ns_orders')
            .select('id')
            .eq('order_id', id)
            .maybeSingle();

        if (existing) {
            console.log(`Order ${id} already exists, skipping.`);
            continue;
        }

        // Find corresponding merchant
        const {data: merchant} = await supabase
            .from('ns_merchants')
            .select('id')
            .eq('shopify_domain', process.env.SHOPIFY_SHOP)
            .maybeSingle();

        if (!merchant) {
            console.error(`Merchant with domain ${process.env.SHOPIFY_SHOP} not found.`);
            continue;
        }

        // Insert order
        const {error: insertErr} = await supabase.from('ns_orders').insert({
            order_id: id,
            merchant_id: merchant.id,
            total_price: totalPrice,
            currency_code: 'AUD',
            created_at: createdAt,
        });

        if (insertErr) {
            console.error(`Failed to insert order ${id}:`, insertErr.message);
        } else {
            console.log(`Inserted order ${id} (${name})`);
        }
    }
};

/**
 * Calculates GMV summary for a set of Supabase orders.
 * Returns: Total GMV, Per-merchant GMV, order count, and AOV
 */
const calculateGMV = (orders) => {
    const merchantStats = {};
    let totalGMV = 0;

    for (const {total_price, ns_merchants: merchant} of orders) {
        // Skip if merchant relation is missing
        if (!merchant) continue;

        const {id, name} = merchant;
        const price = parseFloat(total_price);

        // Initialise merchant record if first time seen
        if (!merchantStats[id]) {
            merchantStats[id] = {id, name, gmv: 0, total_orders: 0};
        }

        merchantStats[id].gmv += price;
        merchantStats[id].total_orders += 1;
        totalGMV += price;
    }

    // Format final summary per merchant
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
    syncShopifyOrders,
    calculateGMV,
    getOrdersFromDB,
};