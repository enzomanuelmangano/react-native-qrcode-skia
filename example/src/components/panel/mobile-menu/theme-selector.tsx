import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Burnt from 'burnt';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../../states';
import { Themes, type ThemeName } from '../../../constants';
import { styles } from './styles';

const formatThemeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

export const ThemeSelector = () => {
  const currentTheme = useSelector(qrcodeState$.currentTheme);

  const handleSelect = useCallback((themeName: ThemeName) => {
    if (themeName === qrcodeState$.currentTheme.peek()) return;
    qrcodeState$.currentTheme.set(themeName);
    Burnt.toast({
      title: `Theme: ${formatThemeName(themeName)}`,
      preset: 'done',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.optionsRow}>
      {(Object.keys(Themes) as ThemeName[]).map((themeName) => {
        const theme = Themes[themeName];
        const isSelected = themeName === currentTheme;
        return (
          <Pressable
            key={themeName}
            onPress={() => handleSelect(themeName)}
            style={[
              styles.colorOption,
              isSelected && { borderColor: theme.colors[0] },
            ]}
          >
            <LinearGradient
              colors={[theme.colors[0], theme.colors[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.colorCircle}
            />
          </Pressable>
        );
      })}
    </View>
  );
};
