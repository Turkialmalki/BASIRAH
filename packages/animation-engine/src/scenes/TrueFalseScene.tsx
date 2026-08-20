import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { TrueFalseScene as TrueFalseSceneType } from "@basirah/content-schema";

export function TrueFalseScene({ scene, onAdvance }: SceneComponentProps<TrueFalseSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { statement, correctAnswer, correctFeedback, incorrectFeedback } = scene.content;
  const [answer, setAnswer] = useState<boolean | null>(null);

  function select(value: boolean) {
    if (answer !== null) return;
    setAnswer(value);
    const correct = value === correctAnswer;
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {});
    setTimeout(() => onAdvance({ kind: "boolean", value, correct }), 1400);
  }

  const Option = ({ value, label }: { value: boolean; label: string }) => {
    const revealed = answer !== null;
    const isThis = answer === value;
    const isCorrect = value === correctAnswer;
    const bg = !revealed ? colors.paperRaised : isCorrect ? colors.successTint : isThis ? colors.dangerTint : colors.paperRaised;
    const border = !revealed ? colors.hairline : isCorrect ? colors.success : isThis ? colors.danger : colors.hairline;
    return (
      <Pressable
        onPress={() => select(value)}
        disabled={revealed}
        style={{ flex: 1, padding: spacing.xl, borderRadius: radius.lg, borderWidth: 1.5, borderColor: border, backgroundColor: bg, alignItems: "center" }}
      >
        <SceneText variant="heading2">{label}</SceneText>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <SceneText variant="quiz">{statement.ar}</SceneText>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Option value={true} label="صح" />
        <Option value={false} label="خطأ" />
      </View>
      {answer !== null && (
        <Animated.View entering={FadeIn.duration(300)}>
          <SceneText variant="body" color={answer === correctAnswer ? colors.success : colors.danger}>
            {answer === correctAnswer ? correctFeedback.ar : incorrectFeedback.ar}
          </SceneText>
        </Animated.View>
      )}
    </View>
  );
}
