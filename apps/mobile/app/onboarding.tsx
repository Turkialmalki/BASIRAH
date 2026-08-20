import { View } from "react-native";
import { Screen } from "../src/components/Screen";
import { BasirahText } from "../src/components/BasirahText";
import { useBasirahTheme } from "../src/theme/ThemeProvider";

/**
 * Onboarding entry point. The full 6-screen emotional journey (spec §8:
 * المعرفة تُرى → interests → goal → daily target → knowledge graph reveal)
 * is built in Phase 2.
 */
export default function OnboardingScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
        <BasirahText variant="displayXL">المعرفة تُرى</BasirahText>
        <BasirahText variant="bodyLarge">تعلّم فكرة عظيمة في 10 دقائق.</BasirahText>
      </View>
    </Screen>
  );
}
