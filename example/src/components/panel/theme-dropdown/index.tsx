import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { ChevronIcon } from '../../icons';
import { Themes, type ThemeName } from '../../../constants';
import { qrcodeState$ } from '../../../states';
import { Colors } from '../../../design-tokens';
import { TimingPresets } from '../../../animations';
import { ThemeOption } from './theme-option';
import { styles } from './styles';

export const ThemeDropdown = () => {
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isTapOpen, setIsTapOpen] = useState(false);
  const animation = useSharedValue(0);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentTheme = useMemo(() => {
    return Themes[currentThemeName];
  }, [currentThemeName]);

  const isOpen = isHovered || isDropdownHovered || isTapOpen;

  const openDropdown = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    animation.value = withTiming(1, TimingPresets.dropdown);
  };

  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => {
      animation.value = withTiming(0, TimingPresets.dropdownClose);
    }, 30);
  };

  const handleButtonHoverIn = () => {
    setIsHovered(true);
    openDropdown();
  };

  const handleButtonHoverOut = () => {
    setIsHovered(false);
    if (!isDropdownHovered && !isTapOpen) {
      closeDropdown();
    }
  };

  const handleDropdownHoverIn = () => {
    setIsDropdownHovered(true);
    openDropdown();
  };

  const handleDropdownHoverOut = () => {
    setIsDropdownHovered(false);
    if (!isHovered && !isTapOpen) {
      closeDropdown();
    }
  };

  const handlePress = () => {
    if (isTapOpen) {
      setIsTapOpen(false);
      closeDropdown();
    } else {
      setIsTapOpen(true);
      openDropdown();
    }
  };

  const handleBackdropPress = () => {
    setIsTapOpen(false);
    setIsHovered(false);
    setIsDropdownHovered(false);
    animation.value = withTiming(0, TimingPresets.dropdownClose);
  };

  const dropdownStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      { translateY: (1 - animation.value) * 4 },
      { scale: 0.97 + animation.value * 0.03 },
    ],
    pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animation.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      {isTapOpen && (
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
      )}

      <Animated.View
        style={[styles.dropdown, dropdownStyle]}
        onPointerEnter={handleDropdownHoverIn}
        onPointerLeave={handleDropdownHoverOut}
      >
        <View style={styles.dropdownContent}>
          {(Object.keys(Themes) as ThemeName[]).map((themeName) => {
            const theme = Themes[themeName];
            const isSelected = themeName === currentThemeName;
            return (
              <ThemeOption
                key={themeName}
                name={themeName}
                theme={theme}
                isSelected={isSelected}
                onPress={() => {
                  qrcodeState$.currentTheme.set(themeName);
                  setIsTapOpen(false);
                  setIsDropdownHovered(false);
                  setIsHovered(false);
                  animation.value = withTiming(0, TimingPresets.dropdownClose);
                }}
              />
            );
          })}
        </View>
      </Animated.View>

      <Pressable
        onPress={handlePress}
        onHoverIn={handleButtonHoverIn}
        onHoverOut={handleButtonHoverOut}
        style={[styles.button, isOpen && styles.buttonHovered]}
      >
        <LinearGradient
          colors={[currentTheme.colors[0], currentTheme.colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedCircle}
        />
        <Text style={[styles.buttonText, isOpen && styles.buttonTextHovered]}>
          Colors
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronIcon color={isOpen ? Colors.iconHovered : Colors.iconMuted} />
        </Animated.View>
      </Pressable>
    </View>
  );
};
