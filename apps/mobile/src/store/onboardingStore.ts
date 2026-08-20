import { create } from "zustand";
import type { GoalSlug, InterestSlug } from "../features/onboarding/data";

/**
 * Ephemeral onboarding answers. Persisted to `preferences` (Supabase) once
 * auth exists (Phase 7) — for now this is in-memory only, which matches
 * spec §8 ("account creation can happen after the user experiences value").
 */
interface OnboardingState {
  interests: InterestSlug[];
  goal: GoalSlug | null;
  dailyTargetMinutes: number;
  toggleInterest: (slug: InterestSlug) => void;
  setGoal: (slug: GoalSlug) => void;
  setDailyTarget: (minutes: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  interests: [],
  goal: null,
  dailyTargetMinutes: 10,
  toggleInterest: (slug) =>
    set((s) => ({
      interests: s.interests.includes(slug)
        ? s.interests.filter((i) => i !== slug)
        : [...s.interests, slug],
    })),
  setGoal: (slug) => set({ goal: slug }),
  setDailyTarget: (minutes) => set({ dailyTargetMinutes: minutes }),
  reset: () => set({ interests: [], goal: null, dailyTargetMinutes: 10 }),
}));
