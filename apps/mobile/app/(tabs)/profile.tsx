import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { useAuth } from "../../src/auth/AuthProvider";
import { GuestUpgradeCard } from "../../src/features/profile/GuestUpgradeCard";
import { useStreak } from "../../src/hooks/useStreak";

export default function ProfileScreen() {
  const { spacing, colors } = useBasirahTheme();
  const { user, isGuest, ready } = useAuth();
  const { data: streak } = useStreak();

  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        <BasirahText variant="displayLarge">حسابي</BasirahText>

        {!ready ? null : (
          <>
            <View style={{ flexDirection: "row", gap: spacing.lg }}>
              <View style={{ flex: 1, alignItems: "center", gap: spacing.xxs }}>
                <BasirahText variant="heading1" color={colors.dune}>
                  {streak?.current_streak_days ?? 0}
                </BasirahText>
                <BasirahText variant="caption" color={colors.inkFaint}>
                  يوم متتالي
                </BasirahText>
              </View>
            </View>

            {isGuest && user ? (
              <GuestUpgradeCard />
            ) : (
              <BasirahText variant="body" color={colors.inkSoft}>
                مسجّل الدخول: {user?.email}
              </BasirahText>
            )}
          </>
        )}

        <BasirahText variant="caption" color={colors.inkFaint}>
          Apple Sign In / Google، الاشتراك، الإعدادات — Phase 7.
        </BasirahText>
      </View>
    </Screen>
  );
}
