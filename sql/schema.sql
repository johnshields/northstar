create
extension if not exists "uuid-ossp";

create table public.ns_merchants
(
    id             uuid primary key         default uuid_generate_v4(),
    name           text not null,
    shopify_domain text not null unique,
    created_at     timestamp with time zone default now()
);

create table public.ns_orders
(
    id            uuid primary key default uuid_generate_v4(),
    merchant_id   uuid                     not null references public.ns_merchants (id) on delete cascade,
    order_id      text                     not null,
    total_price   numeric                  not null,
    currency_code text                     not null,
    created_at    timestamp with time zone not null,

    unique (merchant_id, order_id)
);

create table public.ns_gmv_snapshots
(
    id            uuid primary key default uuid_generate_v4(),
    merchant_id   uuid    not null references public.ns_merchants (id) on delete cascade,
    snapshot_date date    not null,
    gmv           numeric not null,

    unique (merchant_id, snapshot_date)
);
