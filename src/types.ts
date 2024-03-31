import type { StyleProp, ViewStyle } from 'react-native';
import type { ErrorCorrectionLevelType } from './qrcode/generate-matrix';

export type BaseSharedValue<T> = {
  value: T;
};

export type QRCodeProps = {
  value: string;
  style?: StyleProp<ViewStyle>;
  // Level L 7%, level M 15%, level Q 25%, level H 30%.
  errorCorrectionLevel?: ErrorCorrectionLevelType;
  pathColor?: string;
  strokeWidthPercentage?: number | BaseSharedValue<number>;
  children?: React.ReactNode;
  pathStyle?: 'fill' | 'stroke';
  padding?: number;
  size: number;
};
