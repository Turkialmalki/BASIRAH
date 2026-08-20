import { ScrollView, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

/**
 * Home — editorial layout (spec §9). This is a Phase 1 structural
 * placeholder: real sections (بصيرة اليوم, أكمل رحلتك, اختيرت لك, ...)
 * and their differentiated card layouts are built in Phase 2.
 */
export default function HomeScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        <View>
          <BasirahText variant="caption" color="#8A8175">
            صباح المعرفة
          </BasirahText>
          <BasirahText variant="displayLarge" style={{ marginTop: 4 }}>
            بصيرة اليوم
          </BasirahText>
        </View>
        <BasirahText variant="body">
          هذه الشاشة إطار Phase 1. محتوى الصفحة الرئيسية الكامل — الدرس اليومي،
          أكمل رحلتك، اختيرت لك — يُبنى في Phase 2.
        </BasirahText>
      </ScrollView>
    </Screen>
  );
}
