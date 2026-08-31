import { neon } from "@neondatabase/serverless";
import type { Pack } from "./catalog";

// Lazy initialization: top-level neon() would crash next build when
// DATABASE_URL is not configured yet.
let _sql: ReturnType<typeof neon> | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function sql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}

export type OrderStatus = "pending" | "paid" | "abandoned";

export type OrderRow = {
  id: string;
  email: string;
  name: string;
  stripe_session_id: string | null;
  status: OrderStatus;
  total_cents: number;
  created_at: string;
  delivered_at: string | null;
};

export type OrderItemRow = {
  id: number;
  order_id: string;
  product_id: string;
  title: string;
  pack: Pack;
  unit_cents: number;
};

export async function createOrder(input: {
  email: string;
  name: string;
  totalCents: number;
  items: { productId: string; title: string; pack: Pack; unitCents: number }[];
}): Promise<string> {
  const rows = (await sql()`
    insert into orders (email, name, total_cents)
    values (${input.email}, ${input.name}, ${input.totalCents})
    returning id
  `) as { id: string }[];
  const orderId = rows[0].id;
  for (const item of input.items) {
    await sql()`
      insert into order_items (order_id, product_id, title, pack, unit_cents)
      values (${orderId}, ${item.productId}, ${item.title}, ${item.pack}, ${item.unitCents})
    `;
  }
  return orderId;
}

export async function attachStripeSession(orderId: string, sessionId: string): Promise<void> {
  await sql()`update orders set stripe_session_id = ${sessionId} where id = ${orderId}`;
}

export async function markOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await sql()`update orders set status = ${status} where id = ${orderId}`;
}

export async function markOrderDelivered(orderId: string): Promise<void> {
  await sql()`update orders set delivered_at = now() where id = ${orderId}`;
}

export async function getOrder(orderId: string): Promise<OrderRow | null> {
  const rows = (await sql()`select * from orders where id = ${orderId}`) as OrderRow[];
  return rows[0] ?? null;
}

export async function getOrderItems(orderId: string): Promise<OrderItemRow[]> {
  return (await sql()`
    select * from order_items where order_id = ${orderId} order by id
  `) as OrderItemRow[];
}

export async function createDownloadToken(orderId: string, expiresInDays = 7): Promise<string> {
  const rows = (await sql()`
    insert into download_tokens (order_id, expires_at)
    values (${orderId}, now() + make_interval(days => ${expiresInDays}))
    returning token
  `) as { token: string }[];
  return rows[0].token;
}

export type DownloadGrant = {
  order: OrderRow;
  items: OrderItemRow[];
  expiresAt: string;
};

// Resolves a download token to its order and items. Returns null when the
// token is unknown, expired, or the order was never paid.
export async function resolveDownloadToken(token: string): Promise<DownloadGrant | null> {
  const rows = (await sql()`
    select t.expires_at, o.*
    from download_tokens t
    join orders o on o.id = t.order_id
    where t.token = ${token} and t.expires_at > now() and o.status = 'paid'
  `) as (OrderRow & { expires_at: string })[];
  const row = rows[0];
  if (!row) return null;
  const items = await getOrderItems(row.id);
  return { order: row, items, expiresAt: row.expires_at };
}
