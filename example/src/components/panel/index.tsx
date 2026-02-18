import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShapeDropdown } from './shape-dropdown';
import { EyeDropdown } from './eye-dropdown';
import { GapSelector } from './gap-selector';
import { ThemeDropdown } from './theme-dropdown';
import { GradientSelector } from './gradient-selector';
import { LogoDropdown } from './logo-dropdown';
import { ExportButton } from './export-button';
import { qrcodeState$ } from '../../states';

const Separator = () => <View style={styles.separator} />;

export const Panel = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.panel}>
        <View style={styles.controls}>
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
        <ExportButton />
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
    backgroundColor: 'rgba(18,18,18,0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 4,
  },
});
