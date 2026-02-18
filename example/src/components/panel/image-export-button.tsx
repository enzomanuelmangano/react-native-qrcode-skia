import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExportQrCodeImage } from '../qrcode-copy-button/hooks/use-export-qrcode-image';

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
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  buttonHovered: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
