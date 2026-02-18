export const theme = {
  colors: {
    background: '#0a0a0a',
    panelBackground: 'rgba(20, 20, 20, 0.8)',
    panelBorder: 'rgba(255, 255, 255, 0.1)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    textActive: 'rgba(255, 255, 255, 0.95)',
    hoverBackground: 'rgba(255, 255, 255, 0.08)',
    activeBackground: 'rgba(255, 255, 255, 0.12)',
    dropdownBackground: 'rgba(28, 28, 30, 0.85)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

export const SPRING_CONFIG = {
  dampingRatio: 0.9,
  duration: 200,
} as const;
