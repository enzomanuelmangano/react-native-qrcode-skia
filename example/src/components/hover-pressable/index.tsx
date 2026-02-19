import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type HoverPressableProps = {
  children: ReactNode | ((state: { isHovered: boolean; isPressed: boolean }) => ReactNode);
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
};

export const HoverPressable = ({
  children,
  style,
  hoverStyle,
  pressedStyle,
  onPress,
  disabled,
}: HoverPressableProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        style,
        isHovered && hoverStyle,
        isPressed && pressedStyle,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
    >
      {typeof children === 'function'
        ? children({ isHovered, isPressed })
        : children}
    </Pressable>
  );
};
