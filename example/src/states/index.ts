import { atom } from 'jotai';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';

export const BaseShapeAtom = atom<BaseShapeOptions>('circle');
export const EyePatternShapeAtom = atom<BaseShapeOptions>('square');

export const BasePaddingAtom = atom(0);
export const EyePatternPaddingAtom = atom(0);
