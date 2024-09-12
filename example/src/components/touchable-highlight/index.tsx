import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { PressableScale } from '../pressable-scale';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

type TouchableHighlightProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isActive?: boolean;
};

export const TouchableHighlight = React.memo(
  ({ children, onPress, style, isActive }: TouchableHighlightProps) => {
    const progress = useDerivedValue(() => {
      return isActive ? 1 : 0;
    }, [isActive]);

    const rStyle = useAnimatedStyle(() => {
      return {
        borderColor: interpolateColor(
          progress.value,
          [0, 1],
          ['white', '#00f7ff']
        ),
        opacity: interpolate(progress.value, [0, 1], [0.6, 1]),
      };
    }, [isActive]);

    return (
      <PressableScale onPress={onPress} style={[style, rStyle]}>
        {children}
      </PressableScale>
    );
  }
);
