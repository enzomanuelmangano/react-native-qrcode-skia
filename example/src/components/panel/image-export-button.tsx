import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExportQrCodeImage } from '../qrcode-copy-button/hooks/use-export-qrcode-image';
import { Colors, Sizes, BorderRadius } from '../../design-tokens';

export const ImageExportButton = () => {
  const exportImage = useExportQrCodeImage();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.button,
        isHovered && styles.buttonHovered,
        isPressed && styles.buttonPressed,
      ]}
      onPress={exportImage}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Ionicons name="download-outline" size={18} color="rgba(255,255,255,0.7)" />
    </Pressable>
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
