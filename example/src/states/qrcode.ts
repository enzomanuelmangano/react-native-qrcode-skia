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
export const EyePatternShapeAtom = atom<BaseShapeOptions>('square');

export const BasePaddingAtom = atom(0);
export const EyePatternPaddingAtom = atom(0);

export const GradientTypeOptions = [
  'radial',
  'linear',
  'linear-vertical',
  'sweep',
  'conical',
] as const;
type GradientType = (typeof GradientTypeOptions)[number];

export const SelectedGradientAtom = atom<GradientType>('radial');

export const ColorsAtom = atom<string[]>(generateHarmonizedColors());

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

export const SelectedLogoAtom = atom<string>('');
