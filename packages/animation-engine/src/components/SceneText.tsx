import { Text, type TextProps } from "react-native";
import { useSceneTheme } from "../theme";

type Variant = keyof ReturnType<typeof useSceneTheme>["typography"];

export function SceneText({
  variant = "body",
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  const { typography, colors } = useSceneTheme();
  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? colors.ink, writingDirection: "rtl", textAlign: "right" },
        style,
      ]}
      {...rest}
    />
  );
}
