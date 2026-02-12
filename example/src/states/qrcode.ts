import { observable, computed } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';

import { useCallback } from 'react';
import { generateHarmonizedColors } from '../utils';

export const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

export const qrcodeState$ = observable({
  baseShape: 'circle' as BaseShapeOptions,
  eyePatternShape: 'rounded' as BaseShapeOptions,
  baseGap: 0,
  eyePatternGap: 0,
  selectedGradient: 'radial' as GradientType,
  colors: ['#eeca3b', '#3bee3b', '#3bcaee', '#833bee', '#ee3b83'],
  selectedLogo: '🦊',
});

export const GradientTypeOptions = [
  'radial',
  'linear',
  'linear-vertical',
  'sweep',
  'conical',
] as const;
type GradientType = (typeof GradientTypeOptions)[number];

export const filteredColors$ = computed((): string[] => {
  const colors = qrcodeState$.colors.get();
  const gradientType = qrcodeState$.selectedGradient.get();
  if (gradientType !== 'sweep') {
    const first = colors[0] ?? '#000000';
    const last = colors[colors.length - 1] ?? '#000000';
    return [first, last];
  }
  return colors;
});

export const useRandomColors = () => {
  const colors = useSelector(filteredColors$);
  const generateColors = useCallback(() => {
    qrcodeState$.colors.set(generateHarmonizedColors());
  }, []);

  return { colors, generateColors };
};

export const LogoEmojis = ['', '🐶', '🐰', '🦊', '🐼', '🐨'];
