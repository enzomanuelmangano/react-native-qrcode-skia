import {
  LinearGradient,
  SweepGradient,
  TwoPointConicalGradient,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { RadialGradient } from '@shopify/react-native-skia';
import type { GradientTypeOptions } from '../states';

type GradientType = (typeof GradientTypeOptions)[number];

type GetSkiaGradientByTypeParams = {
  gradient: GradientType;
  colors: string[];
  size: number;
};

export const getSkiaGradientStringByType = ({
  gradient,
  colors = ['#a1a1a1', 'transparent'],
  size,
}: GetSkiaGradientByTypeParams) => {
  switch (gradient) {
    case 'radial':
      return `<RadialGradient c={{ x: ${size / 2}, y: ${size / 2} }} r={${size / 2}} colors={${JSON.stringify(colors)}} />`;
    case 'linear':
      return `<LinearGradient start={{ x: 0, y: 0 }} end={{ x: ${size}, y: ${size} }} colors={${JSON.stringify(colors)}} />`;
    case 'linear-vertical':
      return `<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: ${size} }} colors={${JSON.stringify(colors)}} />`;
    case 'sweep':
      return `<SweepGradient c={{ x: ${size / 2}, y: ${size / 2} }} colors={${JSON.stringify(colors)}} />`;
    case 'conical':
      return `<TwoPointConicalGradient start={{ x: ${size / 2}, y: ${size / 2} }} startR={${size / 2}} end={{ x: ${size / 2}, y: 16 }} endR={16} colors={${JSON.stringify(colors)}} />`;
    default:
      return 'null';
  }
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
