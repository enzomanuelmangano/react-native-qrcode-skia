/**
 * Animation duration values in milliseconds.
 * Use these for consistent timing across the app.
 */
export const Duration = {
  /** Ultra fast micro-interactions (50ms) */
  instant: 50,
  /** Fast feedback animations like button press (100ms) */
  fast: 100,
  /** Standard UI transitions (200ms) */
  normal: 200,
  /** Deliberate transitions like modals (300ms) */
  moderate: 300,
  /** Large element transitions like drawers (400ms) */
  slow: 400,
  /** Complex orchestrated animations (500ms) */
  slower: 500,
} as const;

export type DurationKey = keyof typeof Duration;
