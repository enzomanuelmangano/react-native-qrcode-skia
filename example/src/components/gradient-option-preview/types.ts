export type GradientOptionPreviewProps = {
  type: 'radial' | 'linear' | 'linear-vertical' | 'sweep' | 'conical';
  onPress: () => void;
  isActive?: boolean;
};
