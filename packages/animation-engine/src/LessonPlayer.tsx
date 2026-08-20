import { useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { Chapter, Scene } from "@basirah/content-schema";
import { SceneRenderer, isSelfAdvancing } from "./SceneRenderer";
import { ProgressBar } from "./components/ProgressBar";
import { SceneThemeContext, type SceneTheme } from "./theme";
import type { SceneResponse } from "./types";

export interface LessonPlayerProps {
  chapters: Chapter[];
  theme?: SceneTheme;
  /** called once per scene completion, e.g. to write `user_scene_progress` (Phase 5) */
  onSceneComplete?: (scene: Scene, response: SceneResponse | undefined) => void;
  /** called when the last scene of the last chapter completes */
  onLessonComplete?: () => void;
  onExit?: () => void;
}

export function LessonPlayer({
  chapters,
  theme,
  onSceneComplete,
  onLessonComplete,
  onExit,
}: LessonPlayerProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReducedMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", setReducedMotion);
    return () => sub?.remove?.();
  }, []);

  const chapter = chapters[chapterIndex];
  const scene = chapter?.scenes[sceneIndex];

  const isLastSceneOfChapter = chapter ? sceneIndex === chapter.scenes.length - 1 : false;
  const isLastChapter = chapterIndex === chapters.length - 1;

  function goNext() {
    if (!chapter) return;
    if (!isLastSceneOfChapter) {
      setSceneIndex((i) => i + 1);
      return;
    }
    if (!isLastChapter) {
      setChapterIndex((i) => i + 1);
      setSceneIndex(0);
      return;
    }
    onLessonComplete?.();
  }

  function goBack() {
    if (sceneIndex > 0) {
      setSceneIndex((i) => i - 1);
      return;
    }
    if (chapterIndex > 0) {
      const prevChapter = chapters[chapterIndex - 1];
      setChapterIndex((i) => i - 1);
      setSceneIndex((prevChapter?.scenes.length ?? 1) - 1);
    }
  }

  function handleAdvance(response?: SceneResponse) {
    if (scene) onSceneComplete?.(scene, response);
    goNext();
  }

  const themeValue = useMemo(() => theme, [theme]);

  if (!scene) return null;

  const tapToAdvance = !isSelfAdvancing(scene) && scene.interaction?.required !== false;

  const content = (
    <SceneThemeContext.Provider value={themeValue as SceneTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 8 }}>
          <Pressable onPress={onExit} hitSlop={12}>
            <Ionicons name="close" size={22} color={themeValue?.colors.inkFaint} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <ProgressBar total={chapter.scenes.length} current={sceneIndex} />
          </View>
          <Pressable
            onPress={goBack}
            disabled={chapterIndex === 0 && sceneIndex === 0}
            hitSlop={12}
            style={{ opacity: chapterIndex === 0 && sceneIndex === 0 ? 0.3 : 1 }}
          >
            {/* points right — "back" reads correctly in the forced-RTL layout */}
            <Ionicons name="chevron-forward" size={20} color={themeValue?.colors.inkFaint} />
          </Pressable>
        </View>

        <View style={{ flex: 1, padding: 24 }}>
          <SceneRenderer
            key={scene.id}
            scene={scene}
            onAdvance={handleAdvance}
            reducedMotion={reducedMotion}
          />
        </View>
      </SafeAreaView>
    </SceneThemeContext.Provider>
  );

  if (!tapToAdvance) return content;

  return (
    <Pressable style={{ flex: 1 }} onPress={() => handleAdvance()} accessible={false}>
      {content}
    </Pressable>
  );
}
