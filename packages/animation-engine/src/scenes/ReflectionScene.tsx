import { useState } from "react";
import { Pressable, Switch, TextInput, View } from "react-native";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { ReflectionScene as ReflectionSceneType } from "@basirah/content-schema";

export function ReflectionScene({ scene, onAdvance }: SceneComponentProps<ReflectionSceneType>) {
  const { spacing, colors, radius, typography } = useSceneTheme();
  const { prompt, placeholder, maxLength, allowReminder } = scene.content;
  const [text, setText] = useState("");
  // Local-only for now — wiring this to an actual scheduled notification
  // (spec §21 "عندك 7 دقائق؟ بصيرة اليوم جاهزة") is Phase 5/9, once
  // expo-notifications + a backing `notifications` row exist.
  const [reminderOn, setReminderOn] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <SceneText variant="heading2">{prompt.ar}</SceneText>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder?.ar}
        placeholderTextColor={colors.inkFaint}
        maxLength={maxLength}
        multiline
        textAlign="right"
        style={[
          typography.bodyLarge,
          {
            color: colors.ink,
            writingDirection: "rtl",
            minHeight: 120,
            borderWidth: 1.5,
            borderColor: colors.hairline,
            borderRadius: radius.lg,
            padding: spacing.lg,
            backgroundColor: colors.paperRaised,
            textAlignVertical: "top",
          },
        ]}
      />
      {allowReminder && (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <SceneText variant="body">ذكّرني فيها بكرة</SceneText>
          <Switch
            value={reminderOn}
            onValueChange={setReminderOn}
            trackColor={{ true: colors.dune, false: colors.hairline }}
          />
        </View>
      )}
      <Pressable
        onPress={() => onAdvance({ kind: "text", value: text })}
        disabled={text.trim().length === 0}
        style={{
          alignSelf: "flex-end",
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.lg,
          backgroundColor: text.trim().length === 0 ? colors.hairline : colors.dune,
        }}
      >
        <SceneText variant="body" color={text.trim().length === 0 ? colors.inkFaint : colors.paperRaised}>
          حفظ
        </SceneText>
      </Pressable>
    </View>
  );
}
