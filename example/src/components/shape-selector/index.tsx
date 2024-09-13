import { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import React from 'react';

import { TouchableHighlight } from '../touchable-highlight';

type ShapeSelectorProps = {
  shape: BaseShapeOptions;
  onPress: () => void;
  isActive?: boolean;
};

const CanvasSize = 64;
const CanvasStrokeWidth = 2;
const ShapeSize = 24; // Reduced from 64 to 24
const SvgSize = 24; // New constant for SVG size

export const getPathFromShape = (
  shape: BaseShapeOptions,
  shapeSize: number = 24
) => {
  switch (shape) {
    case 'square':
      return `M0,0 H${shapeSize} V${shapeSize} H0 Z`;
    case 'circle':
      return `M${shapeSize / 2},0 A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},${shapeSize} A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},0 Z`;
    case 'rounded':
      return `M4,0 H${shapeSize - 4} A4,4 0 0,1 ${shapeSize},4 V${shapeSize - 4} A4,4 0 0,1 ${shapeSize - 4},${shapeSize} H4 A4,4 0 0,1 0,${shapeSize - 4} V4 A4,4 0 0,1 4,0 Z`;
    case 'diamond':
      const halfSize = shapeSize / 2;
      return `M${halfSize},0 L${shapeSize},${halfSize} L${halfSize},${shapeSize} L0,${halfSize} Z`;
    case 'star':
      const centerX = shapeSize / 2;
      const centerY = shapeSize / 2;
      const outerRadius = shapeSize / 2;
      const innerRadius = outerRadius * 0.4;
      const numPoints = 5;
      let path = '';

      for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
      }
      return `${path} Z`;
    case 'triangle':
      return `M${shapeSize / 2},0 L${shapeSize},${shapeSize} L0,${shapeSize} Z`;
    default:
      return '';
  }
};

export const ShapeSelector = React.memo(
  ({ shape, onPress, isActive }: ShapeSelectorProps) => {
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
