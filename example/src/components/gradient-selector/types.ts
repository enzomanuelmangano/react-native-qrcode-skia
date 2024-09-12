export type GradientSelectorProps = {
  type: 'radial' | 'linear' | 'linear-vertical' | 'sweep' | 'conical';
  onPress: () => void;
  isActive?: boolean;
};
