import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { ChevronIcon } from '../icons';
import { Themes, type ThemeName } from '../../constants';
import { qrcodeState$ } from '../../states';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
  Animation,
} from '../../design-tokens';

const EASING = Easing.out(Easing.cubic);

export const ThemeDropdown = () => {
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const animation = useSharedValue(0);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentTheme = useMemo(() => {
    return Themes[currentThemeName];
  }, [currentThemeName]);

  const isOpen = isHovered || isDropdownHovered;

  const openDropdown = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    animation.value = withTiming(1, { duration: Animation.normal, easing: EASING });
  };

  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => {
      animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
    }, 30);
  };

  const handleButtonHoverIn = () => {
    setIsHovered(true);
    openDropdown();
  };

  const handleButtonHoverOut = () => {
    setIsHovered(false);
    if (!isDropdownHovered) {
      closeDropdown();
    }
  };

  const handleDropdownHoverIn = () => {
    setIsDropdownHovered(true);
    openDropdown();
  };

  const handleDropdownHoverOut = () => {
    setIsDropdownHovered(false);
    if (!isHovered) {
      closeDropdown();
    }
  };

  const dropdownStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [
        { translateY: (1 - animation.value) * 4 },
        { scale: 0.97 + animation.value * 0.03 },
      ],
      pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
    };
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animation.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
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
                  setIsDropdownHovered(false);
                  setIsHovered(false);
                  animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
                }}
              />
            );
          })}
        </View>
      </Animated.View>

      <Pressable
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
          <ChevronIcon
            color={isOpen ? Colors.iconHovered : Colors.iconMuted}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const ThemeOption = ({
  name,
  theme,
  isSelected,
  onPress,
}: {
  name: string;
  theme: { colors: readonly [string, string] };
  isSelected: boolean;
  onPress: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      style={[
        styles.option,
        (isHovered || isSelected) && styles.optionHovered,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.optionCircle}
      />
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  buttonHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  selectedCircle: {
    width: Sizes.iconSmall,
    height: Sizes.iconSmall,
    borderRadius: Sizes.iconSmall / 2,
  },
  buttonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextHovered: {
    color: Colors.textHovered,
  },
  dropdown: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: Spacing.md,
    zIndex: 9999,
  },
  dropdownContent: {
    backgroundColor: Colors.dropdownBackground,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDropdown,
    overflow: 'hidden',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
  },
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  optionCircle: {
    width: Sizes.iconSmall,
    height: Sizes.iconSmall,
    borderRadius: Sizes.iconSmall / 2,
  },
  optionText: {
    color: Colors.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: Colors.textPrimary,
  },
});
