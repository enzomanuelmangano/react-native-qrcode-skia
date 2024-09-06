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

const QRCode: React.FC<QRCodeProps> = React.memo(
  ({
    value,
    style,
    pathColor = '#000000',
    children,
    errorCorrectionLevel = 'H',
    strokeWidth = 1,
    pathStyle = 'fill',
    padding = 0,
    size,
  }) => {
    const canvasSize = size;

    const computedPath = useMemo(() => {
      return transformMatrixIntoPath(
        generateMatrix(value, errorCorrectionLevel),
        size
      );
    }, [value, errorCorrectionLevel, size]);

    const path = useMemo(() => {
      return Skia.Path.MakeFromSVGString(computedPath.path)!;
    }, [computedPath]);

    const maxStrokeWidth = computedPath.cellSize * strokeWidth;

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
          <SkiaPath path={path} color={pathColor} style={pathStyle}>
            {children}
          </SkiaPath>
        </Group>
      </Canvas>
    );
  }
);

export default QRCode;
