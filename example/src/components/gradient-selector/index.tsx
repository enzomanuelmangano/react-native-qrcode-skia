import { Canvas, Rect } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
      style={styles.container}
      isActive={isActive}
      onPress={onPress}
    >
      <Canvas style={styles.fill}>
        <Rect x={0} y={0} width={CanvasSize} height={CanvasSize}>
          {gradientComponent}
        </Rect>
      </Canvas>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
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
