import { Canvas, Rect } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import type { GradientSelectorProps } from './types';
import { getSkiaGradientByType } from './utils';

const CanvasSize = 64;
const CanvasStrokeWidth = 2;

export const GradientSelector = ({
  type,
  onPress,
  isActive,
}: GradientSelectorProps) => {
  const style = useMemo(() => {
    return StyleSheet.flatten([
      styles.container,
      isActive && { borderColor: 'red' },
    ]);
  }, [isActive]);

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
    <TouchableOpacity onPress={onPress}>
      <Canvas style={style}>
        <Rect x={0} y={0} width={CanvasSize} height={CanvasSize}>
          {gradientComponent}
        </Rect>
      </Canvas>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CanvasSize,
    overflow: 'hidden',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: CanvasStrokeWidth,
    borderColor: 'white',
    borderCurve: 'continuous',
  },
});
