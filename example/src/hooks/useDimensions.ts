import { useWindowDimensions } from 'react-native';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const useDimensions = () => {
  const { width, height } = useWindowDimensions();

  const getBreakpoint = () => {
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    return 'xl';
  };

  const isGreaterThan = (breakpoint: keyof typeof breakpoints) => {
    return width >= breakpoints[breakpoint];
  };

  const isLessThan = (breakpoint: keyof typeof breakpoints) => {
    return width < breakpoints[breakpoint];
  };

  return {
    width,
    height,
    breakpoint: getBreakpoint(),
    isGreaterThan,
    isLessThan,
  };
};

export default useDimensions;
