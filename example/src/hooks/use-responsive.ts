import { useWindowDimensions } from 'react-native';

const BREAKPOINTS = {
  // lg breakpoint - use compact layout below this
  lg: 1024,
} as const;

export const useResponsive = () => {
  const { width } = useWindowDimensions();

  return {
    // Use compact layout below lg breakpoint
    isMobile: width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    width,
  };
};
