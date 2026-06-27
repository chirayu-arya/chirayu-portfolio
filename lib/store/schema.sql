-- Store schema for Neon Postgres.
-- Run once against DATABASE_URL (e.g. psql "$DATABASE_URL" -f lib/store/schema.sql
-- or paste into the Neon SQL editor).

create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  stripe_session_id text unique,
  status text not null default 'pending', -- pending | paid | abandoned
  total_cents integer not null,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create table if not exists order_items (
  id serial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  title text not null,
  pack text not null, -- mobile | desktop | both | single
  unit_cents integer not null
);

create table if not exists download_tokens (
  token uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on order_items(order_id);
create index if not exists download_tokens_order_id_idx on download_tokens(order_id);
