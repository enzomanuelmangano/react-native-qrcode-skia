import React, { useState, useRef, useCallback, createContext, useContext } from 'react';
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

// Context to allow children to close the dropdown
const DropdownCloseContext = createContext<(() => void) | null>(null);

export const useDropdownClose = () => useContext(DropdownCloseContext);

// Context to control dropdown direction (for mobile menu)
const DropdownDirectionContext = createContext<'up' | 'down'>('up');

export const DropdownDirectionProvider = DropdownDirectionContext.Provider;

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
  const direction = useContext(DropdownDirectionContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isTapOpen, setIsTapOpen] = useState(false);
  const animation = useSharedValue(0);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const isOpen = isHovered || isDropdownHovered || isTapOpen;

  const openDropdown = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    animation.value = withTiming(1, { duration: Animation.normal, easing: EASING });
  }, [animation]);

  const closeDropdown = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
    }, 30);
  }, [animation]);

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

  // Toggle on tap for mobile
  const handlePress = () => {
    if (isTapOpen) {
      setIsTapOpen(false);
      closeDropdown();
    } else {
      setIsTapOpen(true);
      openDropdown();
    }
  };

  // Close when tapping outside (on the backdrop)
  const handleBackdropPress = () => {
    setIsTapOpen(false);
    setIsHovered(false);
    setIsDropdownHovered(false);
    animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
  };

  // Close function for children to call
  const closeFromChild = useCallback(() => {
    setIsTapOpen(false);
    setIsHovered(false);
    setIsDropdownHovered(false);
    animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
  }, [animation]);

  const dropdownStyle = useAnimatedStyle(() => {
    const translateDirection = direction === 'up' ? 1 : -1;
    return {
      opacity: animation.value,
      transform: [
        { translateY: (1 - animation.value) * 4 * translateDirection },
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
      {/* Backdrop for closing on tap outside */}
      {isTapOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={handleBackdropPress}
        />
      )}

      <Animated.View
        style={[
          styles.dropdown,
          direction === 'down' ? styles.dropdownDown : styles.dropdownUp,
          dropdownStyle,
        ]}
        onPointerEnter={handleDropdownHoverIn}
        onPointerLeave={handleDropdownHoverOut}
      >
        <View style={styles.dropdownContent}>
          <DropdownCloseContext.Provider value={closeFromChild}>
            {children}
          </DropdownCloseContext.Provider>
        </View>
      </Animated.View>

      <Pressable
        onPress={handlePress}
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
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  } as any,
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
    left: 0,
    zIndex: 9999,
  },
  dropdownUp: {
    bottom: '100%',
    marginBottom: Spacing.md,
  },
  dropdownDown: {
    top: '100%',
    marginTop: Spacing.md,
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
