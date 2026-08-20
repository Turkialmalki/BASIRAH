import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح المعرفة";
  if (hour < 17) return "مساء الخير";
  return "مساء المعرفة";
}

export function HomeHeader({ streakDays }: { streakDays: number }) {
  const { colors, spacing } = useBasirahTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <BasirahText variant="heading2">{greeting()}</BasirahText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xxs,
          backgroundColor: colors.duneTint,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          borderRadius: 999,
        }}
      >
        <Ionicons name="flame" size={14} color={colors.duneDeep} />
        <BasirahText variant="caption" color={colors.duneDeep}>
          {streakDays} يوم
        </BasirahText>
      </View>
    </View>
  );
}
