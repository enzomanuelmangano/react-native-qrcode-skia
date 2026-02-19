import type { GradientType } from '../../../states';

export const getGradientLabel = (gradient: GradientType): string => {
  switch (gradient) {
    case 'radial':
      return 'radial';
    case 'linear':
      return 'linear';
    case 'linear-vertical':
      return 'vertical';
    case 'sweep':
      return 'sweep';
    case 'conical':
      return 'conical';
    default:
      return gradient;
  }
};

export const getGradientDirection = (
  gradient: GradientType
): { start: { x: number; y: number }; end: { x: number; y: number } } => {
  switch (gradient) {
    case 'linear':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
    case 'linear-vertical':
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    case 'radial':
    case 'sweep':
    case 'conical':
    default:
      return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
  }
};
