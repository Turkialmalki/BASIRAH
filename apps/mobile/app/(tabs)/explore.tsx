import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

export default function ExploreScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <BasirahText variant="heading1">استكشف</BasirahText>
        <BasirahText variant="body">
          مكتبة الكورسات والتصنيفات (كتب في 10 دقائق، افهم المال، افهم السعودية...) — Phase 2.
        </BasirahText>
      </View>
    </Screen>
  );
}
