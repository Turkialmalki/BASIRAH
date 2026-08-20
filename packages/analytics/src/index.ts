/**
 * PostHog event contract (see docs/architecture.md §Analytics for the full
 * funnel). Kept as a typed union so every call site is checked — never pass
 * a raw string event name from feature code.
 */
export const AnalyticsEvent = {
  OnboardingStarted: "onboarding_started",
  OnboardingCompleted: "onboarding_completed",
  InterestSelected: "interest_selected",
  LessonStarted: "lesson_started",
  SceneViewed: "scene_viewed",
  InteractionCompleted: "interaction_completed",
  LessonCompleted: "lesson_completed",
  QuizAnswered: "quiz_answered",
  InsightSaved: "insight_saved",
  StreakExtended: "streak_extended",
  PaywallViewed: "paywall_viewed",
  TrialStarted: "trial_started",
  SubscriptionStarted: "subscription_started",
  SubscriptionCancelled: "subscription_cancelled",
  AiQuestionSubmitted: "ai_question_submitted",
  AiLessonGenerated: "ai_lesson_generated",
  SearchPerformed: "search_performed",
} as const;
export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export interface AnalyticsClient {
  capture(event: AnalyticsEventName, properties?: Record<string, string | number | boolean>): void;
  identify(userId: string, traits?: Record<string, string | number | boolean>): void;
}

/** No-op client used until the PostHog-backed implementation lands (Phase 9). */
export const noopAnalyticsClient: AnalyticsClient = {
  capture: () => {},
  identify: () => {},
};
