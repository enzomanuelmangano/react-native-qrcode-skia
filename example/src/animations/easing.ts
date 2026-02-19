import { Easing } from 'react-native-reanimated';

/**
 * Easing functions from easing.dev for polished animations.
 * These feel more natural than standard reanimated curves.
 */
export const Ease = {
  /** Quick deceleration - great for standard UI transitions */
  quickOut: Easing.bezier(0, 0, 0.2, 1),

  /** Snappy feel - very fast deceleration, perfect for dropdowns */
  snappyOut: Easing.bezier(0.19, 1, 0.22, 1),

  /** Swift with subtle overshoot - ideal for drawers and modals */
  swiftOut: Easing.bezier(0.175, 0.885, 0.32, 1.1),

  /** More pronounced overshoot - for playful/bouncy elements */
  overshootOut: Easing.bezier(0.175, 0.885, 0.32, 1.275),

  /** Anticipation - pulls back before moving forward */
  anticipate: Easing.bezier(1, -0.4, 0.35, 0.95),

  /** Smooth in-out - for continuous/looping animations */
  inOutCubic: Easing.bezier(0.645, 0.045, 0.355, 1),

  /** Standard ease-in - for elements exiting */
  in: Easing.in(Easing.cubic),

  /** Linear - use sparingly, mainly for progress indicators */
  linear: Easing.linear,
} as const;

export type EaseKey = keyof typeof Ease;
