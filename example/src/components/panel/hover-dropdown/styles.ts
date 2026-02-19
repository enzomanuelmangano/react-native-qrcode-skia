import { StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
} from '../../../design-tokens';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  } as any,
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  buttonHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  buttonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextHovered: {
    color: Colors.textHovered,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    zIndex: 9999,
  },
  dropdownUp: {
    bottom: '100%',
    marginBottom: Spacing.md,
  },
  dropdownDown: {
    top: '100%',
    marginTop: Spacing.md,
  },
  dropdownContent: {
    backgroundColor: Colors.dropdownBackground,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDropdown,
    overflow: 'hidden',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
});
