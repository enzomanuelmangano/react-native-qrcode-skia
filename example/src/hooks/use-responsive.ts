import { useWindowDimensions, Platform } from 'react-native';

const BREAKPOINTS = {
  // lg breakpoint - use compact layout below this
  lg: 1024,
} as const;

export const useResponsive = () => {
  const { width } = useWindowDimensions();

  // On web, useWindowDimensions can return 0 on first render
  const isReady = Platform.OS !== 'web' || width > 0;

  return {
    // Use compact layout below lg breakpoint
    isMobile: width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    width,
    isReady,
  };
};
