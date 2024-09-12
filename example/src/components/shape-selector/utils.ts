import { rect, rrect, Skia } from '@shopify/react-native-skia';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';

export const getPathFromShape = (
  shape: BaseShapeOptions,
  shapeSize: number = 24
) => {
  const skPath = Skia.Path.Make();

  switch (shape) {
    case 'square':
      skPath.addRect(rect(0, 0, shapeSize, shapeSize));
      break;
    case 'circle':
      skPath.addCircle(shapeSize / 2, shapeSize / 2, shapeSize / 2);
      break;
    case 'rounded':
      skPath.addRRect(rrect(rect(0, 0, shapeSize, shapeSize), 4, 4));
      break;
    case 'diamond':
      const halfSize = shapeSize / 2;
      skPath.moveTo(halfSize, 0);
      skPath.lineTo(shapeSize, halfSize);
      skPath.lineTo(halfSize, shapeSize);
      skPath.lineTo(0, halfSize);
      skPath.close();
      break;
    case 'star':
      const centerX = shapeSize / 2;
      const centerY = shapeSize / 2;
      const outerRadius = shapeSize / 2;
      const innerRadius = outerRadius * 0.4;
      const numPoints = 5;

      for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
          skPath.moveTo(x, y);
        } else {
          skPath.lineTo(x, y);
        }
      }
      skPath.close();
      break;
    case 'triangle':
      skPath.moveTo(shapeSize / 2, 0);
      skPath.lineTo(shapeSize, shapeSize);
      skPath.lineTo(0, shapeSize);
      skPath.close();
      break;
  }

  return skPath;
};
