import { Text, type TextProps } from "react-native";
import { useBasirahTheme } from "../theme/ThemeProvider";

type Variant = keyof ReturnType<typeof useBasirahTheme>["typography"];

export function BasirahText({
  variant = "body",
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  const { typography, colors } = useBasirahTheme();
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
