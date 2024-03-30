import React, { useMemo } from 'react';

import {
  Skia,
  Canvas,
  Path as SkiaPath,
  Group,
} from '@shopify/react-native-skia';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ErrorCorrectionLevelType } from './generate-matrix';
import { generateMatrix } from './generate-matrix';
import { transformMatrixIntoPath } from './transform-matrix-into-path';

type SharedValue<T> = {
  value: T;
};

type QRCodeProps = {
  value: string;
  style?: StyleProp<ViewStyle>;
  // Level L 7%, level M 15%, level Q 25%, level H 30%.
  errorCorrectionLevel: ErrorCorrectionLevelType;
  pathColor?: string;
  strokeWidthPercentage?: number | SharedValue<number>;
  children?: React.ReactNode;
  pathStyle?: 'fill' | 'stroke';
  padding?: number;
  size: number;
};

const unwrapValue = <T,>(val: T | SharedValue<T>): T => {
  if ((val as SharedValue<T>).value != null) {
    return (val as SharedValue<T>).value;
  }
  return val as T;
};

const QRCode: React.FC<QRCodeProps> = React.memo(
  ({
    value,
    style,
    pathColor = '#FFFFFF',
    children,
    errorCorrectionLevel = children != null ? 'H' : 'M',
    strokeWidthPercentage = 1,
    pathStyle = 'stroke',
    padding = 0,
    size,
  }) => {
    const canvasSize = size;

    const computedPath = useMemo(() => {
      return transformMatrixIntoPath(
        generateMatrix(value, errorCorrectionLevel),
        size - padding * 2
      );
    }, [value, errorCorrectionLevel, size, padding]);

    const path = useMemo(() => {
      return Skia.Path.MakeFromSVGString(computedPath.path)!;
    }, [computedPath]);

    const maxStrokeWidth = useMemo(() => {
      const normalizedStrokeWidthPercentage = unwrapValue(
        strokeWidthPercentage
      );
      return computedPath.cellSize * normalizedStrokeWidthPercentage;
    }, [computedPath, strokeWidthPercentage]);

    return (
      <Canvas
        style={[
          style,
          {
            width: canvasSize,
            height: canvasSize,
          },
        ]}
      >
        <Group
          transform={[
            {
              translateX: padding,
            },
            { translateY: padding },
          ]}
        >
          <SkiaPath
            path={path}
            color={pathColor}
            strokeWidth={maxStrokeWidth}
            style={pathStyle}
          >
            {children}
          </SkiaPath>
        </Group>
      </Canvas>
    );
  }
);

export default QRCode;
