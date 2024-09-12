import { Canvas, Group, Path } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { getPathFromShape } from './utils';

type ShapeSelectorProps = {
  shape: BaseShapeOptions;
  onPress: () => void;
  isActive?: boolean;
};

const CanvasSize = 64;
const CanvasStrokeWidth = 2;
const ShapeSize = 24;

export const ShapeSelector = ({
  shape,
  onPress,
  isActive,
}: ShapeSelectorProps) => {
  const shapePath = useMemo(() => {
    return getPathFromShape(shape, ShapeSize);
  }, [shape]);

  const style = useMemo(() => {
    return StyleSheet.flatten([
      styles.container,
      isActive && { borderColor: 'red' },
    ]);
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Canvas style={style}>
        <Group
          transform={[
            {
              translateX: (CanvasSize - CanvasStrokeWidth * 2 - ShapeSize) / 2,
            },
            {
              translateY: (CanvasSize - CanvasStrokeWidth * 2 - ShapeSize) / 2,
            },
          ]}
        >
          <Path path={shapePath} color={'white'} />
        </Group>
      </Canvas>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CanvasSize,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: CanvasStrokeWidth,
    borderColor: 'white',
    borderCurve: 'continuous',
  },
});
