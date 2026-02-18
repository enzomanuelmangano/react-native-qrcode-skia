import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ShapeDropdown } from './shape-dropdown';
import { EyeDropdown } from './eye-dropdown';
import { GapSelector } from './gap-selector';
import { ThemeDropdown } from './theme-dropdown';
import { GradientSelector } from './gradient-selector';
import { LogoDropdown } from './logo-dropdown';
import { ExportButton } from './export-button';
import { URLButton } from './url-button';
import { qrcodeState$ } from '../../states';

const Separator = () => <View style={styles.separator} />;

const GitHubIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
    <Path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </Svg>
);

const GitHubButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const onPress = useCallback(() => {
    Linking.openURL(
      'https://github.com/nicepkg/react-native-qrcode-skia'
    );
  }, []);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[styles.githubButton, isHovered && styles.githubButtonHovered]}
    >
      <GitHubIcon />
    </Pressable>
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
    backgroundColor: 'rgba(10,10,10,0.98)',
    borderColor: 'rgba(255,255,255,0.08)',
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 4,
  },
  githubButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  githubButtonHovered: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
