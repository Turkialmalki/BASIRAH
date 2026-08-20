import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";

/**
 * The lesson player route — mounts the Scene Engine (@basirah/animation-engine)
 * against a Course loaded by id/slug. This is the most important screen in
 * the product (spec §10-11) and is built in Phase 3.
 */
export default function LessonScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <BasirahText variant="heading2">مشغّل الدرس — {courseId}</BasirahText>
        <BasirahText variant="body">Scene Engine — Phase 3</BasirahText>
      </View>
    </Screen>
  );
}
