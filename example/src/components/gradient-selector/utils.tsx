import {
  LinearGradient,
  SweepGradient,
  TwoPointConicalGradient,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { RadialGradient } from '@shopify/react-native-skia';
import type { GradientSelectorProps } from './types';

type GetSkiaGradientByTypeParams = {
  gradient: GradientSelectorProps['type'];
  colors: string[];
  size: number;
};

export const getSkiaGradientByType = ({
  gradient,
  colors = ['#a1a1a1', 'transparent'],
  size,
}: GetSkiaGradientByTypeParams) => {
  switch (gradient) {
    case 'radial':
      return (
        <RadialGradient
          c={vec(size / 2, size / 2)}
          r={size / 2}
          colors={colors}
        />
      );
    case 'linear':
      return (
        <LinearGradient
          start={vec(0, 0)}
          end={vec(size, size)}
          colors={colors}
        />
      );
    case 'linear-vertical':
      return (
        <LinearGradient start={vec(0, 0)} end={vec(0, size)} colors={colors} />
      );
    case 'sweep':
      return <SweepGradient c={vec(size / 2, size / 2)} colors={colors} />;
    case 'conical':
      return (
        <TwoPointConicalGradient
          start={vec(size / 2, size / 2)}
          startR={size / 2}
          end={vec(size / 2, 16)}
          endR={16}
          colors={colors}
        />
      );
    default:
      return null;
  }
};
