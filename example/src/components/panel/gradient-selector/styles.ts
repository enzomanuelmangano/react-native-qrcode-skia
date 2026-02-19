import { StyleSheet } from 'react-native';
import { Colors, Spacing, Sizes, BorderRadius } from '../../../design-tokens';

export const styles = StyleSheet.create({
  triggerPreview: {
    width: Sizes.gradientPreview,
    height: Sizes.gradientPreview,
    borderRadius: BorderRadius.sm / 2,
    overflow: 'hidden',
  },
  gradientFill: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  preview: {
    width: Sizes.gradientPreview,
    height: Sizes.gradientPreview,
    borderRadius: BorderRadius.sm / 2,
    overflow: 'hidden',
  },
  optionText: {
    color: Colors.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: Colors.textPrimary,
  },
});
