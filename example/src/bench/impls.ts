import type * as React from 'react';
import BaselineQRCode from './baseline';
import { generateMatrix as baselineMatrix } from './baseline/qrcode/generate-matrix';
import { transformMatrixIntoPath as baselinePath } from './baseline/qrcode/transform-matrix-into-path';
import { Skia } from '@shopify/react-native-skia';
import CurrentQRCode from 'react-native-qrcode-skia';
import type { QRCodeProps, ShapeOptions } from 'react-native-qrcode-skia';

export type Phases = {
  modules: (value: string) => unknown;
  path: (
    modules: any,
    size: number,
    shapeOptions?: ShapeOptions,
    logoAreaSize?: number
  ) => string;
  parse: (svg: string) => unknown;
};

export type Impl = {
  name: string;
  phases: Phases;
  QRCode: React.ComponentType<QRCodeProps>;
  // Full pipeline for one QR code: value -> SkPath (what the component does on mount).
  buildPath: (
    value: string,
    size: number,
    shapeOptions?: ShapeOptions,
    logoAreaSize?: number
  ) => unknown;
};

export const baseline: Impl = {
  name: 'baseline',
  QRCode: BaselineQRCode,
  phases: {
    modules: (value) => baselineMatrix(value, 'H'),
    path: (matrix, size, shapeOptions, logoAreaSize = 0) =>
      baselinePath(matrix, size, shapeOptions, logoAreaSize).path,
    parse: (svg) => Skia.Path.MakeFromSVGString(svg),
  },
  buildPath: (value, size, shapeOptions, logoAreaSize = 0) =>
    Skia.Path.MakeFromSVGString(
      baselinePath(baselineMatrix(value, 'H'), size, shapeOptions, logoAreaSize)
        .path
    ),
};

export const current: Impl = {
  name: 'current',
  QRCode: CurrentQRCode,
  phases: {
    modules: (value) =>
      require('../../../src/qrcode/generate-matrix').generateModules(
        value,
        'H'
      ),
    path: (modules, size, shapeOptions, logoAreaSize = 0) =>
      require('../../../src/qrcode/transform-matrix-into-path').modulesToPath(
        modules.data,
        modules.size,
        size,
        shapeOptions,
        logoAreaSize
      ).path,
    parse: (svg) => Skia.Path.MakeFromSVGString(svg),
  },
  // Uncached pipeline (the component additionally caches by value/options).
  buildPath: (value, size, shapeOptions, logoAreaSize = 0) => {
    const modules = current.phases.modules(value);
    return current.phases.parse(
      current.phases.path(modules, size, shapeOptions, logoAreaSize)
    );
  },
};
