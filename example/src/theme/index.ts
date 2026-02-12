export const theme = {
  colors: {
    background: '#0D0D0D',
    panelBackground: 'rgba(10, 10, 10, 0.8)',
    panelBorder: 'rgba(255, 255, 255, 0.06)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textActive: 'rgba(255, 255, 255, 0.9)',
    hoverBackground: 'rgba(255, 255, 255, 0.08)',
    activeBackground: 'rgba(255, 255, 255, 0.12)',
    dropdownBackground: 'rgba(20, 20, 20, 0.95)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
  },
} as const;

export const SPRING_CONFIG = {
  dampingRatio: 1,
  duration: 150,
} as const;
