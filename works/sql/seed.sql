-- Insert merchants first
INSERT INTO "public"."ns_merchants" ("uid", "name", "shopify_domain")
VALUES ('MERCH_A1B2C3', 'Wavestorm Boards', 'northstar-api.myshopify.com'),
       ('MERCH_D4E5F6', 'Sunset Synths', 'sunsetsynths.myshopify.com');

-- Insert orders
INSERT INTO "public"."ns_orders" ("merchant_uid", "shopify_order_id", "total_price", "currency_code", "created_at")
VALUES ('MERCH_A1B2C3', 'FS3003', '149.50', 'AUD', '2025-08-04 10:00:00+00'),
       ('MERCH_D4E5F6', 'WS1003', '120.00', 'AUD', '2025-08-03 09:15:00+00'),
       ('MERCH_D4E5F6', 'WS1002', '450.00', 'AUD', '2025-08-02 12:30:00+00'),
       ('MERCH_A1B2C3', 'FS3002', '899.00', 'AUD', '2025-08-02 11:30:00+00'),
       ('MERCH_D4E5F6', 'WS1001', '299.99', 'AUD', '2025-08-01 10:00:00+00'),
       ('MERCH_A1B2C3', 'FS3001', '199.99', 'AUD', '2025-08-01 08:00:00+00');