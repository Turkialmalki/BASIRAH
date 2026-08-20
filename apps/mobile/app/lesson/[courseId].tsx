import { useCallback } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LessonPlayer, type SceneResponse } from "@basirah/animation-engine";
import type { Scene } from "@basirah/content-schema";
import { upsertSceneProgress, upsertCourseProgress, touchStreak } from "@basirah/database";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { DEMO_CHAPTER } from "../../src/content/demoLesson";
import { useOnlineCourse } from "../../src/hooks/useOnlineCourses";
import { useAuth } from "../../src/auth/AuthProvider";
import { supabase } from "../../src/lib/supabase";

/**
 * Loads the course by slug from Supabase (falling back to the local
 * registry, then to the Phase 3 smoke-test chapter — see `useOnlineCourse`)
 * and, when signed in (guest or real, spec §27), writes real progress:
 * `user_scene_progress` per scene, `user_course_progress` +
 * `streaks` on completion.
 */
export default function LessonScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useBasirahTheme();
  const { data: course, isLoading } = useOnlineCourse(courseId);
  const { user } = useAuth();

  const chapters = course?.chapters ?? (isLoading ? [] : [DEMO_CHAPTER]);
  const totalMinutes = Math.max(1, Math.round(chapters.reduce((n, c) => n + c.scenes.reduce((m, s) => m + s.duration, 0), 0) / 60));

  const handleSceneComplete = useCallback(
    (scene: Scene, response: SceneResponse | undefined) => {
      if (__DEV__) console.log("[lesson]", courseId, scene.type, response);
      if (!supabase || !user) return; // no backend configured, or auth still resolving — progress just isn't persisted this run
      upsertSceneProgress(supabase, { userId: user.id, sceneId: scene.id, interactionResponse: response }).then(({ error }) => {
        if (error && __DEV__) console.warn("upsertSceneProgress failed", error);
      });
    },
    [courseId, user]
  );

  const handleLessonComplete = useCallback(() => {
    if (supabase && user && course) {
      upsertCourseProgress(supabase, { userId: user.id, courseId: course.id, status: "completed" });
      touchStreak(supabase, { userId: user.id, minutesLearned: totalMinutes });
    }
    Alert.alert("تم 👌", `خلصت درس ${course?.titleAr ?? "المعاينة التجريبية"}.`, [{ text: "رجوع", onPress: () => router.back() }]);
  }, [course, totalMinutes, user]);

  if (chapters.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.paper }}>
        <ActivityIndicator color={theme.colors.dune} />
      </View>
    );
  }

  return (
    <LessonPlayer
      chapters={chapters}
      theme={theme}
      onExit={() => router.back()}
      onSceneComplete={handleSceneComplete}
      onLessonComplete={handleLessonComplete}
    />
  );
}

