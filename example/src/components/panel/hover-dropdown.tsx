import React, { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ChevronIcon } from '../icons';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
  Animation,
} from '../../design-tokens';

const EASING = Easing.out(Easing.cubic);

type HoverDropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  label?: string;
};

export const HoverDropdown = ({
  trigger,
  children,
  label,
}: HoverDropdownProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const animation = useSharedValue(0);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

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
        <View style={styles.dropdownContent}>{children}</View>
      </Animated.View>

      <Pressable
        onHoverIn={handleButtonHoverIn}
        onHoverOut={handleButtonHoverOut}
        style={[styles.button, isOpen && styles.buttonHovered]}
      >
        {trigger}
        {label && (
          <Text style={[styles.buttonText, isOpen && styles.buttonTextHovered]}>
            {label}
          </Text>
        )}
        <Animated.View style={chevronStyle}>
          <ChevronIcon
            color={isOpen ? Colors.iconHovered : Colors.iconMuted}
          />
        </Animated.View>
      </Pressable>
    </View>
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
});
