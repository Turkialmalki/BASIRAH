export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** iOS/Android shadow tokens; consumers map to elevation on Android. */
export const shadow = {
  none: { shadowOpacity: 0, elevation: 0 },
  sm: { shadowColor: "#1B1815", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  md: { shadowColor: "#1B1815", shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  lg: { shadowColor: "#1B1815", shadowOpacity: 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
} as const;

export const motion = {
  duration: {
    instant: 100,
    fast: 200,
    base: 320,
    slow: 480,
    sceneTransition: 600,
  },
  easing: {
    standard: [0.2, 0, 0, 1],
    decelerate: [0, 0, 0, 1],
    accelerate: [0.3, 0, 1, 1],
    spring: { damping: 16, stiffness: 180, mass: 0.9 },
  },
} as const;

export const breakpoints = {
  compact: 0, // phones
  regular: 700, // tablets / split view
} as const;

export const touchTarget = {
  minimum: 44, // dp, matches AccessibilitySpec default in content-schema
  comfortable: 52,
} as const;

export const zIndex = {
  base: 0,
  sceneContent: 10,
  sceneOverlay: 20,
  progressBar: 30,
  navigation: 40,
  modal: 50,
  toast: 60,
} as const;

export const opacity = {
  disabled: 0.4,
  overlay: 0.55,
  pressed: 0.85,
} as const;
