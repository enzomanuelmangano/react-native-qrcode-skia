import type { BaseShapeOptions } from 'react-native-qrcode-skia';

export const getPathFromShape = (
  shape: BaseShapeOptions,
  shapeSize: number = 14
): string => {
  switch (shape) {
    case 'square':
      return `M0,0 H${shapeSize} V${shapeSize} H0 Z`;
    case 'circle':
      return `M${shapeSize / 2},0 A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},${shapeSize} A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},0 Z`;
    case 'rounded': {
      const r = shapeSize * 0.2;
      return `M${r},0 H${shapeSize - r} A${r},${r} 0 0,1 ${shapeSize},${r} V${shapeSize - r} A${r},${r} 0 0,1 ${shapeSize - r},${shapeSize} H${r} A${r},${r} 0 0,1 0,${shapeSize - r} V${r} A${r},${r} 0 0,1 ${r},0 Z`;
    }
    case 'diamond': {
      const halfSize = shapeSize / 2;
      return `M${halfSize},0 L${shapeSize},${halfSize} L${halfSize},${shapeSize} L0,${halfSize} Z`;
    }
    case 'star': {
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
    }
    case 'triangle':
      return `M${shapeSize / 2},0 L${shapeSize},${shapeSize} L0,${shapeSize} Z`;
    default:
      return '';
  }
};
