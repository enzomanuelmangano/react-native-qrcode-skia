import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpringPresets } from '../../../animations';
import { styles } from './styles';
import { ThemeSelector } from './theme-selector';
import { ShapeSelector } from './shape-selector';
import { EyeSelector } from './eye-selector';
import { GapSelector } from './gap-selector';
import { LogoSelector } from './logo-selector';

const CLOSE_THRESHOLD = 100;

interface MobileMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ visible, onClose }: MobileMenuProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const animation = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
    animation.value = withSpring(visible ? 1 : 0, SpringPresets.drawer);
  }, [visible, animation, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_THRESHOLD || event.velocityY > 500) {
        translateY.value = withSpring(windowHeight * 0.8, SpringPresets.drawer);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SpringPresets.drawer);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: animation.value * 0.6 * (1 - translateY.value / (windowHeight * 0.4)),
    pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
  }));

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - animation.value) * windowHeight * 0.8 + translateY.value }],
    opacity: animation.value,
  }));

  if (!visible && animation.value === 0) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.gestureWrapper, wrapperStyle]}>
        <GestureDetector gesture={panGesture}>
          <View style={[styles.menu, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colors</Text>
                <ThemeSelector />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shape</Text>
                <ShapeSelector />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Eye Pattern</Text>
                <EyeSelector />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gap</Text>
                <GapSelector />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Logo</Text>
                <LogoSelector />
              </View>
            </View>
          </View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
};
