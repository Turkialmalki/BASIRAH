import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export function useStreak() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!supabase || !user) return { current_streak_days: 0 };
      const { data } = await supabase.from("streaks").select("current_streak_days").eq("user_id", user.id).maybeSingle();
      return data ?? { current_streak_days: 0 };
    },
    enabled: true,
    initialData: { current_streak_days: 0 },
  });
}
