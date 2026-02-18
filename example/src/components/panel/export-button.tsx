import React, { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { useCopyQrCode } from '../qrcode-copy-button/hooks/use-copy-qrcode';
import { qrcodeState$ } from '../../states';
import { Themes } from '../../constants';

export const ExportButton = () => {
  const copyQrCode = useCopyQrCode();
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.button,
        isHovered && styles.buttonHovered,
        isPressed && styles.buttonPressed,
      ]}
      onPress={copyQrCode}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.buttonText}>Copy</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 10,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
