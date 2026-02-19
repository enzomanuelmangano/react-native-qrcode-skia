import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, Shapes, GapSizes, LogoEmojis } from '../../states';
import { Themes, type ThemeName } from '../../constants';
import { getPathFromShape } from '../../utils/shape-path';
import {
  Colors,
  Spacing,
  BorderRadius,
  Animation,
} from '../../design-tokens';

const EASING = Easing.out(Easing.cubic);

interface MobileMenuProps {
  visible: boolean;
  onClose: () => void;
}

const CLOSE_THRESHOLD = 100;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
};

// Inline Theme Selector
const ThemeSelector = () => {
  const currentTheme = useSelector(qrcodeState$.currentTheme);

  return (
    <View style={styles.optionsRow}>
      {(Object.keys(Themes) as ThemeName[]).map((themeName) => {
        const theme = Themes[themeName];
        const isSelected = themeName === currentTheme;
        return (
          <Pressable
            key={themeName}
            onPress={() => qrcodeState$.currentTheme.set(themeName)}
            style={[styles.colorOption, isSelected && styles.optionSelected]}
          >
            <LinearGradient
              colors={[theme.colors[0], theme.colors[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.colorCircle}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

// Inline Shape Selector
const ShapeSelector = () => {
  const currentShape = useSelector(qrcodeState$.baseShape);

  return (
    <View style={styles.optionsRow}>
      {Shapes.map((shape) => {
        const isSelected = shape === currentShape;
        const shapePath = getPathFromShape(shape, 16);
        return (
          <Pressable
            key={shape}
            onPress={() => qrcodeState$.baseShape.set(shape)}
            style={[styles.shapeOption, isSelected && styles.optionSelected]}
          >
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path d={shapePath} fill={Colors.textPrimary} />
            </Svg>
          </Pressable>
        );
      })}
    </View>
  );
};

// Inline Eye Pattern Selector
const EyeSelector = () => {
  const currentShape = useSelector(qrcodeState$.eyePatternShape);

  return (
    <View style={styles.optionsRow}>
      {Shapes.map((shape) => {
        const isSelected = shape === currentShape;
        const shapePath = getPathFromShape(shape, 16);
        return (
          <Pressable
            key={shape}
            onPress={() => qrcodeState$.eyePatternShape.set(shape)}
            style={[styles.shapeOption, isSelected && styles.optionSelected]}
          >
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path d={shapePath} fill={Colors.textPrimary} />
            </Svg>
          </Pressable>
        );
      })}
    </View>
  );
};

// Inline Gap Selector
const GapSelectorInline = () => {
  const currentGap = useSelector(qrcodeState$.gap);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentTheme];

  return (
    <View style={styles.gapRow}>
      {GapSizes.map((size) => {
        const isSelected = size === currentGap;
        return (
          <Pressable
            key={size}
            onPress={() => qrcodeState$.gap.set(size)}
            style={[
              styles.gapOption,
              isSelected && { backgroundColor: theme.colors[0] },
            ]}
          >
            <Text style={[styles.gapText, isSelected && styles.gapTextSelected]}>
              {size}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

// Inline Logo Selector
const LogoSelector = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);

  return (
    <View style={styles.optionsRow}>
      {LogoEmojis.map((emoji, index) => {
        const isSelected = emoji === selectedLogo;
        return (
          <Pressable
            key={index}
            onPress={() => qrcodeState$.selectedLogo.set(emoji)}
            style={[styles.logoOption, isSelected && styles.optionSelected]}
          >
            <Text style={styles.logoEmoji}>{emoji || '—'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const MobileMenu = ({ visible, onClose }: MobileMenuProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const animation = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
    animation.value = withTiming(visible ? 1 : 0, {
      duration: Animation.normal,
      easing: EASING,
    });
  }, [visible, animation, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_THRESHOLD || event.velocityY > 500) {
        translateY.value = withTiming(windowHeight * 0.8, { duration: Animation.fast });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: animation.value * 0.6 * (1 - translateY.value / (windowHeight * 0.4)),
    pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
  }));

  const menuStyle = useAnimatedStyle(() => ({
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
      <Animated.View
        style={[
          styles.menu,
          menuStyle,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.handleContainer}>
            <View style={styles.handle} />
          </Animated.View>
        </GestureDetector>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <GapSelectorInline />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logo</Text>
            <LogoSelector />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 200,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.panelBackground,
    borderTopLeftRadius: BorderRadius.xl + 4,
    borderTopRightRadius: BorderRadius.xl + 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.borderSubtle,
    maxHeight: '70%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    cursor: 'grab',
  } as any,
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl + 4,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    padding: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  shapeOption: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  logoOption: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  logoEmoji: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  optionSelected: {
    borderColor: Colors.textPrimary,
    backgroundColor: Colors.hoverBackground,
  },
  gapRow: {
    flexDirection: 'row',
    backgroundColor: Colors.buttonBackground,
    borderRadius: BorderRadius.md,
    padding: 3,
    alignSelf: 'flex-start',
  },
  gapOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  gapText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSubtle,
    textTransform: 'uppercase',
  },
  gapTextSelected: {
    color: Colors.textPrimary,
  },
});
