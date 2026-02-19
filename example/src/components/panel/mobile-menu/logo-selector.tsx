import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoEmojis } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';

export const LogoSelector = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];

  return (
    <View style={styles.optionsRow}>
      {LogoEmojis.map((emoji, index) => {
        const isSelected = emoji === selectedLogo;
        return (
          <Pressable
            key={index}
            onPress={() => qrcodeState$.selectedLogo.set(emoji)}
            style={[styles.logoOption, isSelected && { backgroundColor: themeColor }]}
          >
            <Text style={styles.logoEmoji}>{emoji || '—'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
