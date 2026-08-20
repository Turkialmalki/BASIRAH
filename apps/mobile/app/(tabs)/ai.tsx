import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

export default function AiScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <BasirahText variant="heading1">وش ودك تفهم؟</BasirahText>
        <BasirahText variant="body">
          مولّد الدروس البصرية بالذكاء الاصطناعي (@basirah/ai) — Phase 8.
        </BasirahText>
      </View>
    </Screen>
  );
}
