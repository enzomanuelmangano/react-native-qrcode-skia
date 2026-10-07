import React, { useMemo } from 'react';

import { Canvas, Path as SkiaPath, Group } from './skia';

import { buildPath } from './qrcode/build-path';
import type { QRCodeProps } from './types';
import { StyleSheet, View } from 'react-native';

// Shallow comparison, except for `shapeOptions` which is compared by value.
function arePropsEqual(prev: QRCodeProps, next: QRCodeProps): boolean {
  for (const key in next) {
    if (key === 'shapeOptions') continue;
    if (
      !Object.is(prev[key as keyof QRCodeProps], next[key as keyof QRCodeProps])
    )
      return false;
  }
  for (const key in prev) {
    if (!(key in next)) return false;
  }
  const a = prev.shapeOptions;
  const b = next.shapeOptions;
  return (
    a === b ||
    (a?.shape === b?.shape &&
      a?.eyePatternShape === b?.eyePatternShape &&
      a?.gap === b?.gap &&
      a?.eyePatternGap === b?.eyePatternGap)
  );
}

const QRCode: React.FC<QRCodeProps> = React.memo(
  ({
    value,
    style,
    color = '#000000',
    children,
    errorCorrectionLevel = 'H',
    strokeWidth = 1,
    pathStyle = 'fill',
    padding = 0,
    size,
    shapeOptions,
    logo,
    logoAreaSize,
    logoAreaBorderRadius = 0,
  }) => {
    const canvasSize = size;
    const effectiveLogoAreaSize = logoAreaSize ?? (logo ? 70 : 0);

    // Depend on the individual options, not on the object: apps commonly pass
    // `shapeOptions` inline, which is a new object on every render.
    const { shape, eyePatternShape, gap, eyePatternGap } = shapeOptions ?? {};
    const path = useMemo(
      () =>
        buildPath(
          value,
          errorCorrectionLevel,
          size,
          shape,
          eyePatternShape,
          gap,
          eyePatternGap,
          effectiveLogoAreaSize,
          logoAreaBorderRadius
        ),
      [
        value,
        errorCorrectionLevel,
        size,
        shape,
        eyePatternShape,
        gap,
        eyePatternGap,
        effectiveLogoAreaSize,
        logoAreaBorderRadius,
      ]
    );

    const canvasStyle = useMemo(() => {
      return StyleSheet.flatten([
        style,
        {
          width: canvasSize,
          height: canvasSize,
        },
      ]);
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
      <View style={styles.container}>
        <Canvas style={canvasStyle}>
          <Group transform={pathContainerStyle}>
            <SkiaPath
              strokeWidth={strokeWidth}
              path={path}
              color={color}
              style={pathStyle}
            >
              {children}
            </SkiaPath>
          </Group>
        </Canvas>
        {Boolean(logo) && <View style={styles.logo}>{logo}</View>}
      </View>
    );
  },
  arePropsEqual
);

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRCode;

export * from './types';
