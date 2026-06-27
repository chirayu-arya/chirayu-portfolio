import { Resend } from "resend";
import { formatPrice, PACK_LABELS } from "./catalog";
import type { OrderItemRow, OrderRow } from "./db";

let _resend: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function resend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? "Chirayu Arya <store@chirayuarya.com>";

export async function sendOrderConfirmation(input: {
  order: OrderRow;
  items: OrderItemRow[];
  downloadUrl: string;
}): Promise<void> {
  const { order, items, downloadUrl } = input;
  const firstName = order.name.split(" ")[0] || order.name;

  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#1d1d1f;font-size:14px;">
            ${item.title}
            <span style="color:#86868b;"> · ${PACK_LABELS[item.pack]}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#1d1d1f;font-size:14px;text-align:right;">
            ${formatPrice(item.unit_cents)}
          </td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
    <h1 style="font-size:22px;color:#1d1d1f;margin:0 0 8px;">Thank you for your purchase, ${firstName}!</h1>
    <p style="font-size:15px;color:#515154;line-height:1.6;margin:0 0 24px;">
      Your downloads are ready. The link below is valid for 7 days.
    </p>
    <a href="${downloadUrl}"
       style="display:inline-block;background:#1d1d1f;color:#f5f5f7;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:999px;margin-bottom:28px;">
      Download your files
    </a>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      ${rows}
      <tr>
        <td style="padding:12px 0;color:#1d1d1f;font-size:14px;font-weight:600;">Total</td>
        <td style="padding:12px 0;color:#1d1d1f;font-size:14px;font-weight:600;text-align:right;">${formatPrice(order.total_cents)}</td>
      </tr>
    </table>
    <p style="font-size:13px;color:#86868b;line-height:1.6;margin-top:28px;">
      Purchases are licensed for personal use only. If the link expires or anything looks off,
      just reply to this email and I'll sort it out.
    </p>
    <p style="font-size:13px;color:#86868b;margin-top:16px;">Chirayu Arya · chirayuarya.com</p>
  </div>`;

  await resend().emails.send({
    from: FROM,
    to: order.email,
    subject: "Your downloads from chirayuarya.com",
    html,
  });
}
