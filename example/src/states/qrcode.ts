import { atom, useAtomValue, useSetAtom } from 'jotai';
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

export const BaseShapeAtom = atom<BaseShapeOptions>('circle');
export const EyePatternShapeAtom = atom<BaseShapeOptions>('rounded');

export const BaseGapAtom = atom(0);
export const EyePatternGapAtom = atom(0);

export const GradientTypeOptions = [
  'radial',
  'linear',
  'linear-vertical',
  'sweep',
  'conical',
] as const;
type GradientType = (typeof GradientTypeOptions)[number];

export const SelectedGradientAtom = atom<GradientType>('radial');

export const ColorsAtom = atom<string[]>([
  '#eeca3b',
  '#3bee3b',
  '#3bcaee',
  '#833bee',
  '#ee3b83',
]);

export const FilteredColorsAtom = atom<string[]>((get) => {
  const colors = get(ColorsAtom);

  const gradientType = get(SelectedGradientAtom);
  if (gradientType !== 'sweep') {
    const filteredColors = [colors[0], colors[colors.length - 1]];
    return filteredColors as string[];
  }
  return colors;
});

export const useRandomColors = () => {
  const setColors = useSetAtom(ColorsAtom);
  const colors = useAtomValue(FilteredColorsAtom);
  const generateColors = useCallback(() => {
    setColors(generateHarmonizedColors());
  }, [setColors]);

  return { colors, generateColors };
};

export const LogoEmojis = ['', '🐶', '🐰', '🦊', '🐼', '🐨'];

export const SelectedLogoAtom = atom<string>('🦊');
