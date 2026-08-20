import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

/**
 * Reads entitlement from the `subscriptions` table — the actual source
 * of truth, written only by the RevenueCat webhook (server-side, service
 * role — see apps/admin/app/api/revenuecat-webhook). This deliberately
 * does NOT trust RevenueCat's on-device `CustomerInfo` as the gate: a
 * client-side signal is fine for showing purchase-in-progress UI, but
 * unlocking content should always check the row a client can't write to
 * itself (RLS: select-only for the owning user).
 */
export function useEntitlement() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["entitlement", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return { isPlus: false };
      const { data } = await supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return { isPlus: false };

      const stillWithinPeriod = data.current_period_end ? new Date(data.current_period_end) > new Date() : true;
      const isPlus = (data.status === "active" || data.status === "trialing") || (data.status === "cancelled" && stillWithinPeriod);
      return { isPlus };
    },
    initialData: { isPlus: false },
  });

  return query;
}
