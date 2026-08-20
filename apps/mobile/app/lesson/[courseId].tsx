import { Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LessonPlayer } from "@basirah/animation-engine";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { DEMO_CHAPTER } from "../../src/content/demoLesson";

/**
 * Every `courseId` currently plays the same engine smoke-test chapter
 * (`src/content/demoLesson.ts`) — real per-course Chapter[] loaded by
 * slug/id from Supabase lands in Phase 5; the 3 full showcase courses
 * (spec §13-15) are authored in Phase 4. Progress writes
 * (`user_scene_progress`, streaks, saved insights) are also Phase 5 —
 * `onSceneComplete` below is a no-op placeholder on purpose.
 */
export default function LessonScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useBasirahTheme();

  return (
    <LessonPlayer
      chapters={[DEMO_CHAPTER]}
      theme={theme}
      onExit={() => router.back()}
      onSceneComplete={(scene, response) => {
        // Phase 5: upsert user_scene_progress here.
        if (__DEV__) console.log("[lesson]", courseId, scene.type, response);
      }}
      onLessonComplete={() => {
        Alert.alert("تم 👌", "خلصت الدرس التجريبي.", [{ text: "رجوع", onPress: () => router.back() }]);
      }}
    />
  );
}
