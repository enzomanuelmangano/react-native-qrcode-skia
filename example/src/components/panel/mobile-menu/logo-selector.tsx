import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Burnt from 'burnt';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoEmojis } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';

export const LogoSelector = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];

  const handleSelect = useCallback((emoji: string) => {
    if (emoji === qrcodeState$.selectedLogo.peek()) return;
    qrcodeState$.selectedLogo.set(emoji);
    Burnt.toast({
      title: emoji ? `Logo: ${emoji}` : 'Logo: None',
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.optionsRow}>
      {LogoEmojis.map((emoji, index) => {
        const isSelected = emoji === selectedLogo;
        return (
          <Pressable
            key={index}
            onPress={() => handleSelect(emoji)}
            style={[styles.logoOption, isSelected && { backgroundColor: themeColor }]}
          >
            <Text style={styles.logoEmoji}>{emoji || '—'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
