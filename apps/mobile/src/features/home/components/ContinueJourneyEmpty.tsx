import { View } from "react-native";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

/** Intentional empty state (spec §41) — shown until the user has any course in progress. */
export function ContinueJourneyEmpty() {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <BasirahText variant="heading3">أكمل رحلتك</BasirahText>
      <View
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: colors.hairline,
          borderRadius: radius.lg,
          padding: spacing.lg,
        }}
      >
        <BasirahText variant="body" color={colors.inkSoft}>
          لسه ما بدأت درساً.{"\n"}ابدأ ببصيرة اليوم — تاخذ منك دقائق بس.
        </BasirahText>
      </View>
    </View>
  );
}
