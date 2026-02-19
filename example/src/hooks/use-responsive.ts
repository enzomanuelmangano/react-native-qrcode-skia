import { useWindowDimensions, Platform } from 'react-native';

const BREAKPOINTS = {
  // lg breakpoint - use compact layout below this
  lg: 1024,
} as const;

export const useResponsive = () => {
  const { width } = useWindowDimensions();

  // On web, useWindowDimensions can return 0 on first render.
  // Use a sensible default (desktop) to avoid layout flash.
  const effectiveWidth =
    Platform.OS === 'web' && width === 0 ? BREAKPOINTS.lg : width;

  return {
    // Use compact layout below lg breakpoint
    isMobile: effectiveWidth < BREAKPOINTS.lg,
    isDesktop: effectiveWidth >= BREAKPOINTS.lg,
    width: effectiveWidth,
  };
};
