import React, { useCallback } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShapeDropdown } from './shape-dropdown';
import { EyeDropdown } from './eye-dropdown';
import { GapSelector } from './gap-selector';
import { ThemeDropdown } from './theme-dropdown';
import { GradientSelector } from './gradient-selector';
import { LogoDropdown } from './logo-dropdown';
import { ExportButton } from './export-button';
import { ImageExportButton } from './image-export-button';
import { URLButton } from './url-button';
import { GitHubIcon } from '../icons';
import { HoverPressable } from '../hover-pressable';
import { qrcodeState$ } from '../../states';
import { FeatureFlags } from '../../constants';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
} from '../../design-tokens';

const Separator = () => <View style={styles.separator} />;

const GitHubButton = () => {
  const onPress = useCallback(() => {
    Linking.openURL('https://github.com/enzomanuelmangano/react-native-qrcode-skia');
  }, []);

  return (
    <HoverPressable
      style={styles.githubButton}
      hoverStyle={styles.githubButtonHovered}
      onPress={onPress}
    >
      <GitHubIcon />
    </HoverPressable>
  );
};

interface PanelProps {
  onURLButtonPress: () => void;
}

export const Panel = ({ onURLButtonPress }: PanelProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.panel}>
        <View style={styles.controls}>
          <URLButton onPress={onURLButtonPress} />
          <Separator />
          <ThemeDropdown />
          <Separator />
          <GradientSelector />
          <Separator />
          <ShapeDropdown value$={qrcodeState$.baseShape} />
          <EyeDropdown value$={qrcodeState$.eyePatternShape} />
          <Separator />
          <GapSelector />
          <Separator />
          <LogoDropdown />
        </View>
        <View style={styles.actions}>
          {FeatureFlags.ENABLE_IMAGE_EXPORT && <ImageExportButton />}
          <ExportButton />
          <GitHubButton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  panel: {
    height: 56,
    backgroundColor: Colors.panelBackground,
    borderColor: Colors.borderSubtle,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.xs,
  },
  githubButton: {
    width: Sizes.button,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackground,
  },
  githubButtonHovered: {
    backgroundColor: Colors.activeBackground,
  },
});
