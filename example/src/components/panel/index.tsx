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

export const Panel = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.panel}>
        <View style={styles.controls}>
          <ThemeDropdown />
          <GradientSelector />
          <ShapeDropdown value$={qrcodeState$.baseShape} />
          <EyeDropdown value$={qrcodeState$.eyePatternShape} />
          <GapSelector />
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
    left: 16,
    right: 16,
  },
  panel: {
    height: 64,
    backgroundColor: 'rgba(10,10,10,0.8)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
