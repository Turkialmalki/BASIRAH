import { View } from "react-native";
import { useSceneTheme } from "../theme";

/** Segmented progress bar — one segment per scene in the current chapter, per spec §10 ("maintain a subtle progress indicator"). */
export function ProgressBar({ total, current }: { total: number; current: number }) {
  const { colors, spacing } = useSceneTheme();
  return (
    <View style={{ flexDirection: "row", gap: spacing.xxs }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            backgroundColor: i <= current ? colors.dune : colors.hairline,
          }}
        />
      ))}
    </View>
  );
}
