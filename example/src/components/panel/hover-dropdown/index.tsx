import React, { useState, useRef, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ChevronIcon } from '../../icons';
import { Colors, Animation } from '../../../design-tokens';
import { DropdownCloseContext, DropdownDirectionContext } from './context';
import { styles } from './styles';

export { useDropdownClose, DropdownDirectionProvider } from './context';

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
    animation.value = withTiming(0, { duration: Animation.fast, easing: EASING });
  };

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
      {isTapOpen && (
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
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
          <ChevronIcon color={isOpen ? Colors.iconHovered : Colors.iconMuted} />
        </Animated.View>
      </Pressable>
    </View>
  );
};
