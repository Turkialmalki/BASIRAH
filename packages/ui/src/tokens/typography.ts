/**
 * Typography tokens.
 *
 * Font: "Basirah Arabic" — an alias resolved at the app level to a licensed
 * or open Arabic-Latin variable font (e.g. IBM Plex Sans Arabic / Almarai
 * during development; swap for a licensed commercial face before release).
 * Line-heights are generously padded (>=1.5x for body) so Arabic ascenders,
 * descenders, and diacritics never clip.
 */
export const fontFamily = {
  regular: "BasirahArabic-Regular",
  medium: "BasirahArabic-Medium",
  bold: "BasirahArabic-Bold",
  black: "BasirahArabic-Black",
} as const;

type TextStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export const typography: Record<
  | "displayXL"
  | "displayLarge"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bodyLarge"
  | "body"
  | "caption"
  | "micro"
  | "quiz"
  | "quote"
  | "numberDisplay",
  TextStyle
> = {
  displayXL: { fontFamily: fontFamily.black, fontSize: 44, lineHeight: 56, letterSpacing: 0 },
  displayLarge: { fontFamily: fontFamily.black, fontSize: 34, lineHeight: 46, letterSpacing: 0 },
  heading1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 40, letterSpacing: 0 },
  heading2: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 32, letterSpacing: 0 },
  heading3: { fontFamily: fontFamily.medium, fontSize: 18, lineHeight: 27, letterSpacing: 0 },
  bodyLarge: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 27, letterSpacing: 0 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 24, letterSpacing: 0 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20, letterSpacing: 0 },
  micro: { fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16, letterSpacing: 0.2 },
  quiz: { fontFamily: fontFamily.medium, fontSize: 19, lineHeight: 29, letterSpacing: 0 },
  quote: { fontFamily: fontFamily.medium, fontSize: 24, lineHeight: 38, letterSpacing: 0 },
  numberDisplay: { fontFamily: fontFamily.black, fontSize: 56, lineHeight: 64, letterSpacing: -0.5 },
};
