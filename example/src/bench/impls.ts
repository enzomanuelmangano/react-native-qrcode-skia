import type * as React from 'react';
import { Skia } from '@shopify/react-native-skia';
import QRCode from 'react-native-qrcode-skia';
import type { QRCodeProps, ShapeOptions } from 'react-native-qrcode-skia';
import { generateModules } from '../../../src/qrcode/generate-matrix';
import { modulesToPath } from '../../../src/qrcode/transform-matrix-into-path';

// The library internals the benchmark measures. To compare implementations,
// add another `Impl` (e.g. a copy of an older version) to `IMPLS` in bench.tsx.

export type Phases = {
  modules: (value: string) => ReturnType<typeof generateModules>;
  path: (
    modules: ReturnType<typeof generateModules>,
    size: number,
    shapeOptions?: ShapeOptions,
    logoAreaSize?: number
  ) => string;
  parse: (svg: string) => unknown;
};

export type Impl = {
  name: string;
  QRCode: React.ComponentType<QRCodeProps>;
  phases: Phases;
  // Uncached pipeline for one QR code: value -> SkPath.
  buildPath: (
    value: string,
    size: number,
    shapeOptions?: ShapeOptions,
    logoAreaSize?: number
  ) => unknown;
};

const phases: Phases = {
  modules: (value) => generateModules(value, 'H'),
  path: (modules, size, shapeOptions, logoAreaSize = 0) =>
    modulesToPath(modules.data, modules.size, size, shapeOptions, logoAreaSize)
      .path,
  parse: (svg) => Skia.Path.MakeFromSVGString(svg),
};

export const current: Impl = {
  name: 'current',
  QRCode,
  phases,
  buildPath: (value, size, shapeOptions, logoAreaSize) =>
    phases.parse(
      phases.path(phases.modules(value), size, shapeOptions, logoAreaSize)
    ),
};
