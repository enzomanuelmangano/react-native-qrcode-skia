import { Canvas, Rect } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import type { GradientSelectorProps } from './types';
import { getSkiaGradientByType } from './utils';
import { TouchableHighlight } from '../touchable-highlight';

const CanvasSize = 64;
const CanvasStrokeWidth = 2;

export const GradientSelector = ({
  type,
  onPress,
  isActive,
}: GradientSelectorProps) => {
  const MainCanvasSize = CanvasSize - CanvasStrokeWidth * 2;
  const gradientComponent = useMemo(
    () =>
      getSkiaGradientByType({
        gradient: type,
        colors: ['#a1a1a1', 'transparent'],
        size: MainCanvasSize,
      }),
    [type, MainCanvasSize]
  );

  return (
    <TouchableHighlight
      size={CanvasSize}
      borderWidth={CanvasStrokeWidth}
      isActive={isActive}
      onPress={onPress}
    >
      <Canvas
        style={{
          height: CanvasSize,
          width: CanvasSize,
        }}
      >
        <Rect x={0} y={0} width={CanvasSize} height={CanvasSize}>
          {gradientComponent}
        </Rect>
      </Canvas>
    </TouchableHighlight>
  );
};
