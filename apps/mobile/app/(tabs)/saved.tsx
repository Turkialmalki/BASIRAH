import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

export default function SavedScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <BasirahText variant="heading1">المحفوظات</BasirahText>
        <BasirahText variant="body">
          لسه ما حفظت أي فكرة.{"\n"}إذا مرّت عليك فكرة تستحق ترجع لها، اضغط ♡.
        </BasirahText>
      </View>
    </Screen>
  );
}
