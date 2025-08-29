-- Drop existing tables
DROP TABLE IF EXISTS public.ns_orders;
DROP TABLE IF EXISTS public.ns_merchants;

CREATE
EXTENSION IF NOT EXISTS pgcrypto;

-- Helper: UID generator (PREFIX_XXXXXX)
CREATE
OR REPLACE FUNCTION gen_uid(prefix TEXT)
RETURNS TEXT AS $$
BEGIN
RETURN prefix || '_' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
END;
$$
LANGUAGE plpgsql;

-- Helper: keep updated_at fresh
CREATE
OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at
:= now();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TABLE public.ns_merchants
(
    id             SERIAL PRIMARY KEY,
    uid            TEXT                     NOT NULL UNIQUE DEFAULT gen_uid('MERCH'),
    name           TEXT                     NOT NULL,
    shopify_domain TEXT                     NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT NOW(),
    CONSTRAINT ns_merchants_test_shopify_domain_key UNIQUE (shopify_domain)
) TABLESPACE pg_default;

CREATE TABLE public.ns_orders
(
    id               SERIAL PRIMARY KEY,
    uid              TEXT                     NOT NULL UNIQUE DEFAULT gen_uid('ORDER'),
    merchant_uid     TEXT                     NOT NULL,
    shopify_order_id TEXT                     NOT NULL,
    total_price      NUMERIC                  NOT NULL,
    currency_code    TEXT                     NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL        DEFAULT NOW(),
    CONSTRAINT ns_orders_merchant_uid_shopify_order_id_key UNIQUE (merchant_uid, shopify_order_id),
    CONSTRAINT ns_orders_merchant_uid_fkey FOREIGN KEY (merchant_uid) REFERENCES ns_merchants (uid) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Triggers for updated_at
CREATE TRIGGER trg_merchants_updated
    BEFORE UPDATE
    ON ns_merchants
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated
    BEFORE UPDATE
    ON ns_orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();