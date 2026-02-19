import type { StyleProp, ViewStyle } from 'react-native';
import type { ErrorCorrectionLevelType } from './qrcode/generate-matrix';
import type {
  ShapeOptions,
  BaseShapeOptions,
} from './qrcode/transform-matrix-into-path';

export type { ShapeOptions, BaseShapeOptions, ErrorCorrectionLevelType };

/**
 * Represents the props for a QRCode component.
 */
export type QRCodeProps = {
  /** The value encoded in the QRCode. */
  value: string;
  /** The style applied to the QRCode container. */
  style?: StyleProp<ViewStyle>;
  /**
   * The error correction level for the QRCode.
   * Level L: 7%, level M: 15%, level Q: 25%, level H: 30%.
   * Default value is 'H'.
   */
  errorCorrectionLevel?: ErrorCorrectionLevelType;
  /** The color of the QRCode base path.
   * Default value is '#000000'.
   */
  color?: string;
  /**
   * The stroke width in pixels when pathStyle is 'stroke'.
   * Default value is 1.
   */
  strokeWidth?: number;
  /** The children components rendered within the QRCode container. */
  children?: React.ReactNode;
  /**
   * The style of the QRCode path: 'fill' or 'stroke'.
   * Default value is 'fill'.
   */
  pathStyle?: 'fill' | 'stroke';
  /**
   * The padding applied around the QRCode.
   * Default value is 0.
   */
  padding?: number;
  /** The size of the QRCode. */
  size: number;
  /**
   * The shape options for the QRCode path.
   * Defaults: shape='rounded', eyePatternShape='rounded', gap=0, eyePatternGap=0, logoAreaBorderRadius=0.
   */
  shapeOptions?: ShapeOptions;
  /**
   * The size of the area cleared for the logo in the center of the QR code.
   * Default value is 70 when logo is provided, 0 otherwise.
   */
  logoAreaSize?: number;
  /**
   * A React node to render as the logo in the center of the QR code.
   * When provided, a square area is cleared in the center to make room for the logo.
   */
  logo?: React.ReactNode;
};
