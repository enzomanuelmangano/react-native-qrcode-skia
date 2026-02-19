import type { WithTimingConfig, WithSpringConfig } from 'react-native-reanimated';
import { Duration } from './timing';
import { Ease } from './easing';

/**
 * Pre-configured animation configs for common UI patterns.
 * Use these with withTiming() or withSpring() for consistency.
 * Easing curves sourced from easing.dev for natural motion.
 */

// Timing-based presets
export const TimingPresets = {
  /** Quick feedback for small UI elements (buttons, icons) */
  microInteraction: {
    duration: Duration.fast,
    easing: Ease.snappyOut,
  } satisfies WithTimingConfig,

  /** Standard dropdown/popover animations */
  dropdown: {
    duration: Duration.normal,
    easing: Ease.snappyOut,
  } satisfies WithTimingConfig,

  /** Closing dropdowns - slightly faster */
  dropdownClose: {
    duration: Duration.fast,
    easing: Ease.quickOut,
  } satisfies WithTimingConfig,

  /** Modal/dialog entrance */
  modalIn: {
    duration: Duration.moderate,
    easing: Ease.swiftOut,
  } satisfies WithTimingConfig,

  /** Modal/dialog exit */
  modalOut: {
    duration: Duration.normal,
    easing: Ease.in,
  } satisfies WithTimingConfig,

  /** Bottom sheet/drawer entrance */
  drawerIn: {
    duration: Duration.moderate,
    easing: Ease.snappyOut,
  } satisfies WithTimingConfig,

  /** Bottom sheet/drawer exit */
  drawerOut: {
    duration: Duration.normal,
    easing: Ease.quickOut,
  } satisfies WithTimingConfig,

  /** Snap back after drag gesture - quick and natural */
  snapBack: {
    duration: Duration.normal,
    easing: Ease.snappyOut,
  } satisfies WithTimingConfig,

  /** Panel fade in/out */
  panelFade: {
    duration: Duration.normal,
    easing: Ease.quickOut,
  } satisfies WithTimingConfig,

  /** Content blur transition */
  blur: {
    duration: Duration.moderate,
    easing: Ease.quickOut,
  } satisfies WithTimingConfig,
} as const;

// Spring-based presets
export const SpringPresets = {
  /** Drawer/bottom sheet - critically damped, smooth */
  drawer: {
    dampingRatio: 1,
    duration: 500,
  } satisfies WithSpringConfig,

  /** Bouncy feel for playful interactions */
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  } satisfies WithSpringConfig,

  /** Snappy spring for quick responses */
  snappy: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  } satisfies WithSpringConfig,

  /** Gentle spring for subtle movements */
  gentle: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  } satisfies WithSpringConfig,

  /** QR code rotation spring */
  rotation: {
    damping: 10,
    stiffness: 80,
    mass: 1,
  } satisfies WithSpringConfig,
} as const;

export type TimingPresetKey = keyof typeof TimingPresets;
export type SpringPresetKey = keyof typeof SpringPresets;
