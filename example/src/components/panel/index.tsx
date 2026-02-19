import React, { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimingPresets } from '../../animations';
import { ShapeDropdown } from './shape-dropdown';
import { EyeDropdown } from './eye-dropdown';
import { GapSelector } from './gap-selector';
import { ThemeDropdown } from './theme-dropdown';
import { GradientSelector } from './gradient-selector';
import { LogoDropdown } from './logo-dropdown';
import { ExportButton } from './export-button';
import { ImageExportButton } from './image-export-button';
import { URLButton } from './url-button';
import { MobileMenu } from './mobile-menu';
import { GitHubIcon, MenuIcon } from '../icons';
import { HoverPressable } from '../hover-pressable';
import { useResponsive } from '../../hooks/use-responsive';
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
      style={styles.iconButton}
      hoverStyle={styles.iconButtonHovered}
      onPress={onPress}
    >
      <GitHubIcon />
    </HoverPressable>
  );
};

interface PanelProps {
  onURLButtonPress: () => void;
  drawerProgress?: SharedValue<number>;
}

export const Panel = ({ onURLButtonPress, drawerProgress }: PanelProps) => {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
  const [menuVisible, setMenuVisible] = useState(false);
  const panelAnimation = useSharedValue(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    panelAnimation.value = withTiming(menuVisible ? 0 : 1, TimingPresets.panelFade);
  }, [menuVisible, panelAnimation]);

  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelAnimation.value,
    transform: [{ scale: 0.95 + panelAnimation.value * 0.05 }],
  }));

  const openMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  if (isMobile) {
    return (
      <>
        <Animated.View style={[styles.container, { bottom: Math.max(insets.bottom, 16) }, panelStyle]}>
          <View style={styles.mobilePanel}>
            <HoverPressable
              style={styles.iconButton}
              hoverStyle={styles.iconButtonHovered}
              onPress={openMenu}
            >
              <MenuIcon color={Colors.iconDefault} />
            </HoverPressable>
            <URLButton onPress={onURLButtonPress} />
            <View style={styles.mobileActions}>
              {FeatureFlags.ENABLE_IMAGE_EXPORT && <ImageExportButton />}
              <ExportButton />
              <GitHubButton />
            </View>
          </View>
        </Animated.View>
        <MobileMenu visible={menuVisible} onClose={closeMenu} progress={drawerProgress} />
      </>
    );
  }

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
  mobilePanel: {
    height: 56,
    backgroundColor: Colors.panelBackground,
    borderColor: Colors.borderSubtle,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    marginHorizontal: Spacing.xl,
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
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: 'auto',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.xs,
  },
  iconButton: {
    width: Sizes.button,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackground,
  },
  iconButtonHovered: {
    backgroundColor: Colors.activeBackground,
  },
});
