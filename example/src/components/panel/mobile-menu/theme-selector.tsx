import React from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../../states';
import { Themes, type ThemeName } from '../../../constants';
import { styles } from './styles';

export const ThemeSelector = () => {
  const currentTheme = useSelector(qrcodeState$.currentTheme);

  return (
    <View style={styles.optionsRow}>
      {(Object.keys(Themes) as ThemeName[]).map((themeName) => {
        const theme = Themes[themeName];
        const isSelected = themeName === currentTheme;
        return (
          <Pressable
            key={themeName}
            onPress={() => qrcodeState$.currentTheme.set(themeName)}
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
