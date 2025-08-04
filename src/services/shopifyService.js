// Simulates a Shopify Admin GraphQL API response
// Ref: https://shopify.dev/docs/api/admin-graphql/latest/queries/orders

const supabase = require('../db/supabaseClient');

/**
 * Fetch Shopify-style orders for a given merchant from Supabase.
 * The response mimics Shopify's GraphQL orders query format.
 */
const getShopifyOrders = async (merchant) => {
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

module.exports = {
    shopifyFetcher: getShopifyOrders
};
