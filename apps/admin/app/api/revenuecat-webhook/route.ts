import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "../../../src/lib/supabaseServer";

/**
 * RevenueCat webhook — the *only* writer of the `subscriptions` table
 * (spec §26/§28: "never expose service role key client-side"; RLS's
 * `subscriptions_self_read` policy in 0002_rls.sql is select-only for
 * users on purpose — a client can never mark its own subscription
 * active). Configure this URL + `REVENUECAT_WEBHOOK_SECRET` as the
 * Authorization header value in the RevenueCat dashboard's webhook
 * settings once a real RevenueCat project exists.
 *
 * Event → plan/status mapping is deliberately simple (see PLAN_BY_PRODUCT
 * below) — RevenueCat's product ids are the source of truth for which
 * plan a purchase maps to, matched by substring so the exact store
 * product id format (varies by platform/store) doesn't need to be
 * hardcoded here.
 */

const PLAN_BY_PRODUCT: { match: string; plan: "plus_monthly" | "plus_yearly" }[] = [
  { match: "monthly", plan: "plus_monthly" },
  { match: "yearly", plan: "plus_yearly" },
  { match: "annual", plan: "plus_yearly" },
];

function resolvePlan(productId: string): "plus_monthly" | "plus_yearly" {
  const lower = productId.toLowerCase();
  return PLAN_BY_PRODUCT.find((p) => lower.includes(p.match))?.plan ?? "plus_monthly";
}

const ACTIVE_EVENTS = new Set(["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE"]);
const CANCELLED_EVENTS = new Set(["CANCELLATION"]);
const EXPIRED_EVENTS = new Set(["EXPIRATION"]);
const PAST_DUE_EVENTS = new Set(["BILLING_ISSUE"]);

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!process.env.REVENUECAT_WEBHOOK_SECRET || auth !== process.env.REVENUECAT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const event = body?.event;
  if (!event?.app_user_id || !event?.type) {
    return NextResponse.json({ error: "malformed event" }, { status: 400 });
  }

  const status = ACTIVE_EVENTS.has(event.type)
    ? event.period_type === "TRIAL"
      ? "trialing"
      : "active"
    : CANCELLED_EVENTS.has(event.type)
      ? "cancelled"
      : EXPIRED_EVENTS.has(event.type)
        ? "expired"
        : PAST_DUE_EVENTS.has(event.type)
          ? "past_due"
          : null;

  if (!status) {
    // Event type we don't act on (e.g. TRANSFER) — acknowledge without writing.
    return NextResponse.json({ ok: true, skipped: event.type });
  }

  const client = supabaseAdmin();
  const { error } = await client.from("subscriptions").upsert(
    {
      user_id: event.app_user_id,
      provider: "revenuecat",
      plan: resolvePlan(event.product_id ?? ""),
      status,
      current_period_end: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
