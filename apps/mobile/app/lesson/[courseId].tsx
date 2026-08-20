import { Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LessonPlayer } from "@basirah/animation-engine";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { DEMO_CHAPTER } from "../../src/content/demoLesson";
import { getCourseBySlug } from "../../src/content/registry";

/**
 * `courseId` is looked up in the local course registry (the 3 showcase
 * courses from spec §13-15 — Phase 4). Any unrecognized id falls back to
 * the Phase 3 engine smoke-test chapter rather than crashing, so a stale
 * link never dead-ends the player. Real per-course loading from Supabase
 * (and progress persistence — `user_scene_progress`, streaks, saved
 * insights) is Phase 5; `onSceneComplete` below stays a no-op placeholder.
 */
export default function LessonScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useBasirahTheme();
  const course = getCourseBySlug(courseId);
  const chapters = course?.chapters ?? [DEMO_CHAPTER];

  return (
    <LessonPlayer
      chapters={chapters}
      theme={theme}
      onExit={() => router.back()}
      onSceneComplete={(scene, response) => {
        // Phase 5: upsert user_scene_progress here.
        if (__DEV__) console.log("[lesson]", courseId, scene.type, response);
      }}
      onLessonComplete={() => {
        Alert.alert("تم 👌", `خلصت درس ${course?.title ?? "المعاينة التجريبية"}.`, [
          { text: "رجوع", onPress: () => router.back() },
        ]);
      }}
    />
  );
}
