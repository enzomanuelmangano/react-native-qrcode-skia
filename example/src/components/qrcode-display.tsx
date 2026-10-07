import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { useCopyQrCode } from './qrcode-copy-button/hooks/use-copy-qrcode';
import { Colors, Sizes } from '../design-tokens';

export const QRCodeDisplay = () => {
  const copyQrCode = useCopyQrCode();
  // WithSkiaWeb suspends while CanvasKit loads. Mount it only on the client so
  // static rendering (which now awaits Suspense) emits the loader instead.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = useSharedValue(false);

  const tapGesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      active.value = true;
    })
    .onTouchesUp(() => {
      runOnJS(copyQrCode)();
    })
    .onFinalize(() => {
      active.value = false;
    });

  const hoverGesture = Gesture.Hover()
    .activeCursor('grab')
    .onBegin(() => {
      active.value = true;
    })
    .onFinalize(() => {
      active.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active.value ? 0.97 : 1) }],
  }));

  const gestures = Gesture.Simultaneous(tapGesture, hoverGesture);

  const loader = (
    <View style={styles.loader}>
      <ActivityIndicator size="small" color={Colors.loaderColor} />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gestures}>
        <Animated.View style={animatedStyle}>
          {mounted ? (
            <WithSkiaWeb
              getComponent={() => import('./qrcode')}
              fallback={loader}
            />
          ) : (
            loader
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: Sizes.qrCode,
    height: Sizes.qrCode,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
