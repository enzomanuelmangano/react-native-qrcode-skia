import React, { useMemo } from 'react';

import {
  Skia,
  Canvas,
  Path as SkiaPath,
  Group,
} from '@shopify/react-native-skia';

import { generateMatrix } from './qrcode/generate-matrix';
import { transformMatrixIntoPath } from './qrcode/transform-matrix-into-path';
import type { QRCodeProps } from './types';
import { unwrapValue } from './utils/unwrap-value';

const QRCode: React.FC<QRCodeProps> = React.memo(
  ({
    value,
    style,
    pathColor = '#000000',
    children,
    errorCorrectionLevel = 'H',
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

    const canvasStyle = useMemo(() => {
      return [
        style,
        {
          width: canvasSize,
          height: canvasSize,
        },
      ];
    }, [style, canvasSize]);

    const pathContainerStyle = useMemo(() => {
      return [
        {
          translateX: padding,
        },
        { translateY: padding },
      ];
    }, [padding]);

    return (
      <Canvas style={canvasStyle}>
        <Group transform={pathContainerStyle}>
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
