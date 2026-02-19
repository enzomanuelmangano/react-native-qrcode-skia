import { StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  BorderRadius,
} from '../../../design-tokens';

export const styles = StyleSheet.create({
  container: {
    zIndex: 200,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.panelBackground,
    borderTopLeftRadius: BorderRadius.xl + 4,
    borderTopRightRadius: BorderRadius.xl + 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.borderSubtle,
    maxHeight: '70%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    cursor: 'grab',
  } as any,
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl + 4,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  shapeOption: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOption: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  gapRow: {
    flexDirection: 'row',
    backgroundColor: Colors.buttonBackground,
    borderRadius: BorderRadius.md,
    padding: 3,
    alignSelf: 'flex-start',
  },
  gapOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  gapText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSubtle,
    textTransform: 'uppercase',
  },
  gapTextSelected: {
    color: Colors.textPrimary,
  },
});
