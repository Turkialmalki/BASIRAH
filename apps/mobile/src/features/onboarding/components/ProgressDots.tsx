import { View } from "react-native";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function ProgressDots({ total, current }: { total: number; current: number }) {
  const { colors, spacing } = useBasirahTheme();
  return (
    <View style={{ flexDirection: "row", gap: spacing.xs, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current ? colors.dune : colors.hairline,
          }}
        />
      ))}
    </View>
  );
}
