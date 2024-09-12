import {
  Canvas,
  LinearGradient,
  RadialGradient,
  Rect,
  SweepGradient,
  TwoPointConicalGradient,
  vec,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type GradientSelectorProps = {
  type: 'radial' | 'linear' | 'linear-vertical' | 'sweep' | 'conical';
  onPress: () => void;
  isActive?: boolean;
};

const CanvasSize = 64;
const CanvasStrokeWidth = 2;

const getGradient = (gradient: GradientSelectorProps['type'], size: number) => {
  switch (gradient) {
    case 'radial':
      return (
        <RadialGradient
          c={vec(size / 2, size / 2)}
          r={size / 2}
          colors={['#a1a1a1', 'transparent']}
        />
      );
    case 'linear':
      return (
        <LinearGradient
          start={vec(0, 0)}
          end={vec(size, size)}
          colors={['#a1a1a1', 'transparent']}
        />
      );
    case 'linear-vertical':
      return (
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, size)}
          colors={['#a1a1a1', 'transparent']}
        />
      );
    case 'sweep':
      return (
        <SweepGradient
          c={vec(size / 2, size / 2)}
          colors={['#a1a1a1', 'transparent']}
        />
      );
    case 'conical':
      return (
        <TwoPointConicalGradient
          start={vec(size / 2, size / 2)}
          startR={size / 2}
          end={vec(size / 2, 16)}
          endR={16}
          colors={['#a1a1a1  ', 'transparent']}
        />
      );
    default:
      return null;
  }
};

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
  const gradientComponent = getGradient(type, MainCanvasSize);

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
