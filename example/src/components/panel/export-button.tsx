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

  return (
    <Pressable
      style={[styles.button, isHovered && styles.buttonHovered]}
      onPress={copyQrCode}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
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
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHovered: {
    opacity: 0.9,
    transform: [{ scale: 1.02 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
});
