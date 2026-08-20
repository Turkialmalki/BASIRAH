/**
 * Basirah color tokens.
 *
 * Palette intent: warm editorial paper + deep ink, with a single confident
 * accent (dune gold) and a cool counter-accent (deep palm) for contrast —
 * deliberately not "SaaS purple," not gradient-heavy, not dashboard-blue.
 * Values are the LIGHT theme; dark theme overrides live in `colors.dark.ts`.
 */
export type ColorPalette = Record<
  | "ink"
  | "inkSoft"
  | "inkFaint"
  | "paper"
  | "paperRaised"
  | "hairline"
  | "dune"
  | "duneDeep"
  | "duneTint"
  | "palm"
  | "palmDeep"
  | "palmTint"
  | "success"
  | "successTint"
  | "warning"
  | "warningTint"
  | "danger"
  | "dangerTint"
  | "info"
  | "infoTint"
  | "categoryMoney"
  | "categoryPsychology"
  | "categoryLeadership"
  | "categoryTech"
  | "categoryHistory"
  | "categoryGrowth"
  | "categoryEntrepreneurship"
  | "categorySaudi"
  | "overlay"
  | "scrim",
  string
>;

export const colors: ColorPalette = {
  // Neutrals — warm, not clinical gray
  ink: "#1B1815", // primary text
  inkSoft: "#4A443D", // secondary text
  inkFaint: "#8A8175", // tertiary / placeholder text
  paper: "#FAF6EF", // app background
  paperRaised: "#FFFFFF", // cards, sheets
  hairline: "#E7DFD1", // dividers, borders

  // Brand accents
  dune: "#C08A3E", // primary accent — CTAs, highlights, active states
  duneDeep: "#8F651F", // pressed/hover state of dune
  duneTint: "#F3E3C6", // accent surface (badges, selected chips)
  palm: "#1F4741", // counter-accent — secondary CTAs, knowledge graph
  palmDeep: "#123029",
  palmTint: "#D9E7E2",

  // Semantic
  success: "#2E7D5B",
  successTint: "#DCEEE4",
  warning: "#B8722C",
  warningTint: "#F5E4CE",
  danger: "#B34632",
  dangerTint: "#F5DED7",
  info: "#2F5F8A",
  infoTint: "#DCE7F0",

  // Category colors (knowledge graph, category chips) — muted, editorial
  categoryMoney: "#8F651F",
  categoryPsychology: "#6B4C8A",
  categoryLeadership: "#1F4741",
  categoryTech: "#2F5F8A",
  categoryHistory: "#7A4A3A",
  categoryGrowth: "#B8722C",
  categoryEntrepreneurship: "#B34632",
  categorySaudi: "#0E6B4F",

  overlay: "rgba(27, 24, 21, 0.55)",
  scrim: "rgba(27, 24, 21, 0.08)",
} as const;

export type ColorToken = keyof typeof colors;
