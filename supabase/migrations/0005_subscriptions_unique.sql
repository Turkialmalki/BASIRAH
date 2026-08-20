-- One current-state row per user (RevenueCat itself is the source of
-- truth for subscription *history* — a webhook event log doesn't need to
-- be replicated here). The webhook handler (apps/admin
-- app/api/revenuecat-webhook/route.ts) upserts on this constraint so a
-- renewal/cancellation/expiration event updates the same row rather than
-- appending a new one.
alter table subscriptions add constraint subscriptions_user_id_key unique (user_id);
