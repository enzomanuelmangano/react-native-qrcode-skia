import { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import React from 'react';

import { TouchableHighlight } from '../touchable-highlight';
import { getPathFromShape } from './utils';

export type ShapeOptionPreviewProps = {
  shape: BaseShapeOptions;
  onPress: () => void;
  isActive?: boolean;
};

const CanvasSize = 64;
const CanvasStrokeWidth = 2;
const ShapeSize = 24; // Reduced from 64 to 24
const SvgSize = 24; // New constant for SVG size

export const ShapeOptionPreview = React.memo(
  ({ shape, onPress, isActive }: ShapeOptionPreviewProps) => {
    const shapePath = useMemo(() => {
      return getPathFromShape(shape, ShapeSize);
    }, [shape]);

    return (
      <TouchableHighlight
        onPress={onPress}
        isActive={isActive}
        size={CanvasSize}
        borderWidth={CanvasStrokeWidth}
      >
        <Svg
          width={SvgSize}
          height={SvgSize}
          viewBox={`0 0 ${ShapeSize} ${ShapeSize}`}
        >
          <Path d={shapePath} fill="white" />
        </Svg>
      </TouchableHighlight>
    );
  }
);
