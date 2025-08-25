const supabase = require('../clients/supabaseClient');
const shopify = require('../clients/shopifyClient');
const {generateUID} = require('../../utils/utils');
const config = require('../../config');

/**
 * Fetches Shopify order-level sales data for a single merchant.
 * Returns: [{ id, name, createdAt, totalPrice, currencyCode }]
 * Ref: https://shopify.dev/docs/api/admin-graphql/latest/queries/orders
 */
const shopifyFetcher = async () => {
    const session = {
        shop: config.SHOPIFY_SHOP,
        accessToken: config.SHOPIFY_ACCESS_TOKEN,
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
              currencyCode
            }
          }
        }
    }`;

    const response = await client.query({data: query});

    return response.body?.data?.orders?.edges.map(edge => edge.node) || [];
}

// Fetches latest Shopify orders and inserts them into database.
const syncShopifyOrders = async () => {
    const orders = await shopifyFetcher();

    for (const order of orders) {
        const {id, name, createdAt, totalPrice, currencyCode} = order;

        // Skip if order already exists
        const {data: existing} = await supabase
            .from('ns_orders')
            .select('uid')
            .eq('shopify_order_id', id)
            .maybeSingle();

        if (existing) {
            console.log(`Order ${id} already exists, skipping.`);
            continue;
        }

        // Find relevant merchant
        const {data: merchant} = await supabase
            .from('ns_merchants')
            .select('uid')
            .eq('shopify_domain', config.SHOPIFY_SHOP)
            .maybeSingle();

        if (!merchant) {
            console.error(`Merchant with domain ${config.SHOPIFY_SHOP} not found.`);
            continue;
        }

        // Insert order with generated UID
        const {error: insertErr} = await supabase.from('ns_orders').insert({
            uid: generateUID('ORDER'),
            shopify_order_id: id,
            merchant_uid: merchant.uid,
            total_price: totalPrice,
            currency_code: currencyCode,
            created_at: createdAt,
        });

        if (insertErr) {
            console.error(`Failed to insert order ${id}:`, insertErr.message);
        } else {
            console.log(`Inserted order ${id} (${name})`);
        }
    }
};

// Retrieves orders from database - all orders or single order by UID
const listOrders = async (uid = null) => {
    let query = supabase
        .from('ns_orders')
        .select('*')
        .order('created_at', {ascending: true});

    // If UID provided, filter by it
    if (uid) {
        query = query.eq('uid', uid).maybeSingle();
    }

    const {data, error} = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Creates a new order in database.
const createOrder = async (orderData) => {
    const {data, error} = await supabase
        .from('ns_orders')
        .insert({uid: generateUID('ORDER'), ...orderData})
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Updates order by UID in database.
const updateOrderByUID = async (uid, updateData) => {
    // Check if order exists first
    const {data: existing} = await supabase
        .from('ns_orders')
        .select('uid')
        .eq('uid', uid)
        .maybeSingle();

    if (!existing) {
        return null; // Order not found
    }

    const {data, error} = await supabase
        .from('ns_orders')
        .update(updateData)
        .eq('uid', uid)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Deletes order by UID in database.
const deleteOrderByUID = async (uid) => {
    // Check if order exists first
    const {data: existing} = await supabase
        .from('ns_orders')
        .select('uid')
        .eq('uid', uid)
        .maybeSingle();

    if (!existing) {
        return null; // Order not found
    }

    const {data, error} = await supabase
        .from('ns_orders')
        .delete()
        .eq('uid', uid)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

module.exports = {
    shopifyFetcher,
    syncShopifyOrders,
    listOrders,
    createOrder,
    updateOrderByUID,
    deleteOrderByUID,
};