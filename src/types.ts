import type { StyleProp, ViewStyle } from 'react-native';
import type { ErrorCorrectionLevelType } from './qrcode/generate-matrix';

/**
 * Represents a base shared value.
 * @template T - The type of the shared value.
 */
export type BaseSharedValue<T> = {
  value: T;
};

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
  /** The color of the QRCode path.
   * Default value is '#000000'.
   */
  pathColor?: string;
  /**
   * The percentage of the strokeWidth (0 to 1)
   * Default value is 1.
   */
  strokeWidthPercentage?: number;
  /** The children components rendered within the QRCode container. */
  children?: React.ReactNode;
  /**
   * The style of the QRCode path: 'fill' or 'stroke'.
   * Default value is 'stroke'.
   */
  pathStyle?: 'fill' | 'stroke';
  /**
   * The padding applied around the QRCode.
   * Default value is 0.
   */
  padding?: number;
  /** The size of the QRCode. */
  size: number;
};
