import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { PressableScale } from 'pressto';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Burnt from '../../../utils/toast';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../../states';
import { Themes, type ThemeName } from '../../../constants';
import { styles } from './styles';

const formatThemeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

const AnimatedPressableScale = Animated.createAnimatedComponent(PressableScale);

interface ColorOptionProps {
  themeName: ThemeName;
  isSelected: boolean;
  onPress: () => void;
}

const ColorOption = ({ themeName, isSelected, onPress }: ColorOptionProps) => {
  const theme = Themes[themeName];
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', theme.colors[0]]
    ),
  }));

  return (
    <AnimatedPressableScale
      onPress={onPress}
      style={[styles.colorOption, animatedStyle]}
    >
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.colorCircle}
      />
    </AnimatedPressableScale>
  );
};

export const ThemeSelector = () => {
  const currentTheme = useSelector(qrcodeState$.currentTheme);

  const handleSelect = useCallback((themeName: ThemeName) => {
    if (themeName === qrcodeState$.currentTheme.peek()) return;
    qrcodeState$.currentTheme.set(themeName);
    Burnt.toast({
      title: `Theme: ${formatThemeName(themeName)}`,
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.optionsRow}>
      {(Object.keys(Themes) as ThemeName[]).map((themeName) => (
        <ColorOption
          key={themeName}
          themeName={themeName}
          isSelected={themeName === currentTheme}
          onPress={() => handleSelect(themeName)}
        />
      ))}
    </View>
  );
};
