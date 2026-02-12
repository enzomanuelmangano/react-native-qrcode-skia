import { observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Themes, type ThemeName } from '../constants';

export const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

export const GapSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type GapSize = (typeof GapSizes)[number];

export const GapValues: Record<GapSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const qrcodeState$ = observable({
  baseShape: 'circle' as BaseShapeOptions,
  eyePatternShape: 'rounded' as BaseShapeOptions,
  gap: 'xs' as GapSize,
  selectedGradient: 'radial' as GradientType,
  currentTheme: 'raindrop' as ThemeName,
  selectedLogo: '🦊',
});

export const GradientTypeOptions = [
  'radial',
  'linear',
  'linear-vertical',
  'sweep',
  'conical',
] as const;
export type GradientType = (typeof GradientTypeOptions)[number];

export const getCurrentTheme = () => {
  const themeName = qrcodeState$.currentTheme.get();
  return Themes[themeName];
};

export const LogoEmojis = ['', '🐶', '🐰', '🦊', '🐼', '🐨'];
