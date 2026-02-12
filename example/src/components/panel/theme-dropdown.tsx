import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';

import { Themes, type ThemeName } from '../../constants';
import { qrcodeState$ } from '../../states';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const OPEN_CONFIG = {
  dampingRatio: 1,
  duration: 150,
};

const CLOSE_CONFIG = {
  dampingRatio: 1,
  duration: 300,
};

const Chevron = ({ color = 'rgba(255,255,255,0.4)' }: { color?: string }) => (
  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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
    animation.value = withSpring(1, OPEN_CONFIG);
  };

  const closeDropdown = () => {
    closeTimeout.current = setTimeout(() => {
      animation.value = withSpring(0, CLOSE_CONFIG);
    }, 50);
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
        { translateY: interpolate(animation.value, [0, 1], [4, 0]) },
      ],
      pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
    };
  });

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(animation.value, [0, 1], [0, 50]),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dropdown, dropdownStyle]}
        onPointerEnter={handleDropdownHoverIn}
        onPointerLeave={handleDropdownHoverOut}>
        <AnimatedBlurView
          tint="dark"
          animatedProps={blurProps}
          style={styles.blurContainer}>
          <View style={styles.dropdownContent}>
            {(Object.keys(Themes) as ThemeName[]).map(themeName => {
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
                    animation.value = withSpring(0, CLOSE_CONFIG);
                  }}
                />
              );
            })}
          </View>
        </AnimatedBlurView>
      </Animated.View>

      <Pressable
        onHoverIn={handleButtonHoverIn}
        onHoverOut={handleButtonHoverOut}
        style={[styles.button, isOpen && styles.buttonHovered]}>
        <LinearGradient
          colors={[currentTheme.colors[0], currentTheme.colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedCircle}
        />
        <Text style={[styles.buttonText, isOpen && styles.buttonTextHovered]}>
          {currentThemeName}
        </Text>
        <Animated.View style={chevronStyle}>
          <Chevron color={isOpen ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const ThemeOption = ({ name, theme, isSelected, onPress }: {
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
      onHoverOut={() => setIsHovered(false)}>
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.optionCircle}
      />
      <Text style={[styles.optionText, (isHovered || isSelected) && styles.optionTextHovered]}>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 8,
  },
  buttonHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  selectedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  buttonTextHovered: {
    color: 'rgba(255,255,255,0.9)',
  },
  dropdown: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 4,
    zIndex: 1000,
  },
  blurContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownContent: {
    backgroundColor: 'rgba(20,20,20,0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    minWidth: 140,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  optionHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  optionCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  optionTextHovered: {
    color: '#fff',
  },
});
