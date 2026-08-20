import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { MultipleChoiceScene as MultipleChoiceSceneType } from "@basirah/content-schema";

export function MultipleChoiceScene({ scene, onAdvance }: SceneComponentProps<MultipleChoiceSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { question, options, correctOptionId, correctFeedback, incorrectFeedback } = scene.content;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function select(optionId: string) {
    if (selectedId) return; // one answer per scene — spec §16 gives meaningful feedback, not a retry loop
    setSelectedId(optionId);
    const correct = optionId === correctOptionId;
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {});
    setTimeout(() => onAdvance({ kind: "choice", optionId, correct }), 1400);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <SceneText variant="quiz">{question.ar}</SceneText>
      <View style={{ gap: spacing.sm }}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrectOption = opt.id === correctOptionId;
          const revealed = selectedId !== null;
          const bg = !revealed
            ? colors.paperRaised
            : isCorrectOption
              ? colors.successTint
              : isSelected
                ? colors.dangerTint
                : colors.paperRaised;
          const border = !revealed ? colors.hairline : isCorrectOption ? colors.success : isSelected ? colors.danger : colors.hairline;

          return (
            <Pressable
              key={opt.id}
              onPress={() => select(opt.id)}
              disabled={revealed}
              style={{
                padding: spacing.lg,
                borderRadius: radius.lg,
                borderWidth: 1.5,
                borderColor: border,
                backgroundColor: bg,
              }}
            >
              <SceneText variant="body">{opt.label.ar}</SceneText>
            </Pressable>
          );
        })}
      </View>
      {selectedId && (
        <Animated.View entering={FadeIn.duration(300)}>
          <SceneText variant="body" color={selectedId === correctOptionId ? colors.success : colors.danger}>
            {selectedId === correctOptionId ? correctFeedback.ar : incorrectFeedback.ar}
          </SceneText>
        </Animated.View>
      )}
    </View>
  );
}
