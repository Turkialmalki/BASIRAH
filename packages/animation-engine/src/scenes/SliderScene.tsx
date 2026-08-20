import { useState } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { SliderScene as SliderSceneType } from "@basirah/content-schema";

const TRACK_WIDTH = 280;
const THUMB_SIZE = 28;

export function SliderScene({ scene, onAdvance }: SceneComponentProps<SliderSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { prompt, min, max, step, defaultValue, unit } = scene.content;

  // "worklet" so these are callable from both JS (render) and the gesture's UI-thread worklets below.
  const valueToX = (v: number) => {
    "worklet";
    return ((v - min) / (max - min)) * (TRACK_WIDTH - THUMB_SIZE);
  };
  const xToValue = (x: number) => {
    "worklet";
    const raw = min + (x / (TRACK_WIDTH - THUMB_SIZE)) * (max - min);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };

  const x = useSharedValue(valueToX(defaultValue));
  const startX = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(defaultValue);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
    })
    .onUpdate((e) => {
      const next = Math.min(TRACK_WIDTH - THUMB_SIZE, Math.max(0, startX.value + e.translationX));
      x.value = next;
    })
    .onChange(() => {
      "worklet";
      const v = xToValue(x.value);
      runOnJS(setDisplayValue)(v);
    })
    .onEnd(() => {
      x.value = withSpring(valueToX(xToValue(x.value)), { damping: 16 });
    });

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + THUMB_SIZE / 2 }));

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xxl }}>
      <SceneText variant="quiz">{prompt.ar}</SceneText>

      <View style={{ alignItems: "center", gap: spacing.xl }}>
        <SceneText variant="numberDisplay" color={colors.dune}>
          {displayValue}
          {unit}
        </SceneText>

        <View style={{ width: TRACK_WIDTH, height: THUMB_SIZE }}>
          <View
            style={{
              position: "absolute",
              top: THUMB_SIZE / 2 - 3,
              width: TRACK_WIDTH,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.hairline,
            }}
          />
          <Animated.View
            style={[
              { position: "absolute", top: THUMB_SIZE / 2 - 3, height: 6, borderRadius: 3, backgroundColor: colors.dune },
              fillStyle,
            ]}
          />
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: THUMB_SIZE / 2,
                  backgroundColor: colors.dune,
                  borderWidth: 3,
                  borderColor: colors.paperRaised,
                },
                thumbStyle,
              ]}
            />
          </GestureDetector>
        </View>
      </View>

      <Pressable
        onPress={() => onAdvance({ kind: "slider", value: displayValue })}
        style={{ alignSelf: "center", paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.dune }}
      >
        <SceneText variant="body" color={colors.paperRaised}>
          متابعة
        </SceneText>
      </Pressable>
    </View>
  );
}
