import React, { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { PressableScale } from '../pressable-scale';
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

type TouchableHighlightProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  isActive?: boolean;
  size?: number;
  borderWidth?: number;
};

export const TouchableHighlight = React.memo(
  ({
    children,
    onPress,
    style,
    isActive,
    size,
    borderWidth,
  }: TouchableHighlightProps) => {
    const progress = useDerivedValue(() => {
      return isActive ? 1 : 0;
    }, [isActive]);

    const rStyle = useAnimatedStyle(() => {
      return {
        borderColor: 'white',
        opacity: interpolate(progress.value, [0, 1], [0.4, 1]),
      };
    }, [isActive]);

    const containerStyle = useMemo(() => {
      return [
        styles.container,
        {
          borderWidth: borderWidth,
          height: size,
        },
        style,
      ];
    }, [style, borderWidth, size]);

    return (
      <PressableScale onPress={onPress} style={[containerStyle, rStyle]}>
        {children}
      </PressableScale>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    aspectRatio: 1,
    borderRadius: 24,
    borderColor: 'white',
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
