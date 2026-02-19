import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExportQrCodeImage } from '../qrcode-copy-button/hooks/use-export-qrcode-image';
import { HoverPressable } from '../hover-pressable';
import { Colors, Sizes, BorderRadius } from '../../design-tokens';

export const ImageExportButton = () => {
  const exportImage = useExportQrCodeImage();

  return (
    <HoverPressable
      style={styles.button}
      hoverStyle={styles.buttonHovered}
      pressedStyle={styles.buttonPressed}
      onPress={exportImage}
    >
      <Ionicons name="download-outline" size={18} color="rgba(255,255,255,0.7)" />
    </HoverPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: Sizes.button,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonBackground,
  },
  buttonHovered: {
    backgroundColor: Colors.activeBackground,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
