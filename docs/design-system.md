# Basirah — Design System (Phase 1 tokens)

Full spec in the design system section of the master build command (§5-6).
This doc covers what's implemented in `packages/ui` today; components are
built alongside the screens that need them (Phase 2+), not speculatively.

## Visual intent

Editorial, calm, premium — closer to a well-typeset print magazine or a
museum exhibition wall than a SaaS dashboard. Concretely, that means: no
generic SaaS purple, no heavy gradients, no card-grid-everywhere layout.
Large type, generous whitespace, full-bleed illustration, and motion that
explains rather than decorates.

## Color

`packages/ui/src/tokens/colors.ts` (light) + `colors.dark.ts` (dark).
Warm neutrals (`ink`/`paper`, not black/white) with one confident accent
(**dune**, a warm gold) and one counter-accent (**palm**, a deep green) —
deliberately not blue/purple, to avoid reading as a generic fintech or
SaaS product. Eight muted category colors back the knowledge-graph and
category chips (`categoryMoney`, `categoryPsychology`, ... `categorySaudi`)
so categories are visually distinct without turning the app into a rainbow.

Both palettes are exported together as `theme.light` / `theme.dark` and
selected at runtime by `ThemeProvider` (`apps/mobile/src/theme`) from
`useColorScheme()`.

## Typography

`packages/ui/src/tokens/typography.ts`. Font family is aliased as
`BasirahArabic-{Regular,Medium,Bold,Black}` — resolved at the app level to
a licensed or open Arabic/Latin variable font (see the "Type" section of
`README.md`'s environment checklist; nothing commercial is bundled by
default). Twelve named styles (`displayXL` → `numberDisplay`) per spec §6,
with line-heights set generously (1.4–1.5×+) specifically so Arabic
ascenders/descenders/diacritics never clip — this was tuned against
Arabic text, not inherited from a Latin default.

`BasirahText` (`apps/mobile/src/components/BasirahText.tsx`) is the only
primitive that should render text in the app: it applies the right
typography token, defaults to `writingDirection: rtl` / `textAlign:
right`, and resolves color from the active theme.

## Spacing, radius, shadow, motion

`packages/ui/src/tokens/layout.ts`:

- `spacing` — 10-step scale, `none`→`huge` (0–64)
- `radius` — `none`→`pill`
- `shadow` — `none`/`sm`/`md`/`lg`, pre-mapped to both `shadow*` (iOS) and
  `elevation` (Android) so components don't hand-roll platform branches
- `motion.duration` — `instant`(100)/`fast`(200)/`base`(320)/`slow`(480)/
  `sceneTransition`(600), and `motion.easing` — the curves/spring params
  the animation engine (Phase 3) reads by name rather than each scene
  hardcoding its own timing
- `breakpoints`, `touchTarget` (44dp minimum, matching
  `AccessibilitySpec.minTouchTarget` in `content-schema`), `zIndex`,
  `opacity`

## What's deliberately not here yet

No `Button`/`Card`/`Chip` component library ships in Phase 1 — building
generic components before the screens that need them tends to produce the
"dashboard-card-everywhere" look the spec explicitly asks to avoid.
Components are added per-screen starting in Phase 2 (onboarding/home/
library), pulling from these tokens, and only promoted into `packages/ui`
once a pattern repeats across ≥2 screens.
