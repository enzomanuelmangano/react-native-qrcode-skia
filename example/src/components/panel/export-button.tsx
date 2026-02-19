import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@legendapp/state/react';
import { useCopyQrCode } from '../qrcode-copy-button/hooks/use-copy-qrcode';
import { HoverPressable } from '../hover-pressable';
import { qrcodeState$ } from '../../states';
import { Themes } from '../../constants';
import { Colors, Sizes, BorderRadius } from '../../design-tokens';

export const ExportButton = () => {
  const copyQrCode = useCopyQrCode();
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];

  return (
    <HoverPressable
      style={styles.button}
      hoverStyle={styles.buttonHovered}
      pressedStyle={styles.buttonPressed}
      onPress={copyQrCode}
    >
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Ionicons name="copy-outline" size={Sizes.icon} color={Colors.textPrimary} />
    </HoverPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: Sizes.button,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHovered: {
    opacity: 0.92,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
