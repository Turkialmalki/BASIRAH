import { Platform } from "react-native";
import Purchases, { type PurchasesOffering, type PurchasesPackage } from "react-native-purchases";

const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const androidKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

/**
 * RevenueCat is a native module — it needs a custom dev build (not Expo
 * Go) and real store product ids to do anything. Every function here is
 * a safe no-op when unconfigured, same fallback pattern as
 * `src/lib/supabase.ts`, so the rest of the app (paywall included) never
 * crashes without a RevenueCat project wired up. The `subscriptions`
 * table stays the actual source of truth for entitlement (see
 * `useEntitlement`) — this module only drives the store purchase UI and
 * hands off to RevenueCat's webhook (apps/admin
 * app/api/revenuecat-webhook) to update that table server-side.
 */
export const purchasesConfigured = Boolean(iosKey || androidKey);

let configuredForUser: string | null = null;

export async function configurePurchases(userId: string): Promise<void> {
  if (!purchasesConfigured || configuredForUser === userId) return;
  const apiKey = Platform.OS === "ios" ? iosKey : androidKey;
  if (!apiKey) return;
  try {
    Purchases.configure({ apiKey, appUserID: userId });
    configuredForUser = userId;
  } catch (e) {
    if (__DEV__) console.warn("[purchases] configure failed", e);
  }
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!purchasesConfigured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    if (__DEV__) console.warn("[purchases] getOfferings failed", e);
    return null;
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<{ ok: boolean; error?: string }> {
  try {
    await Purchases.purchasePackage(pkg);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Purchase failed." };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  try {
    await Purchases.restorePurchases();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Restore failed." };
  }
}
