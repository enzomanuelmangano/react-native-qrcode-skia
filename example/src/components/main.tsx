import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Panel } from './panel';
import { QRCodeDisplay } from './qrcode-display';
import { URLInputModal } from './url-input-modal';
import { Colors } from '../design-tokens';
import { TimingPresets } from '../animations';

export default function App() {
  const [isURLModalVisible, setIsURLModalVisible] = useState(false);
  const contentBlur = useSharedValue(0);

  const handleURLButtonPress = useCallback(() => {
    setIsURLModalVisible(true);
  }, []);

  const handleURLModalClose = useCallback(() => {
    setIsURLModalVisible(false);
  }, []);

  const handleMenuVisibilityChange = useCallback((visible: boolean) => {
    contentBlur.value = withTiming(visible ? 1 : 0, TimingPresets.blur);
  }, [contentBlur]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Use CSS filter for web blur effect
    if (Platform.OS === 'web') {
      return {
        filter: `blur(${contentBlur.value * 8}px)`,
        transform: [{ scale: 1 - contentBlur.value * 0.02 }],
      } as any;
    }
    // For native, just scale down slightly
    return {
      transform: [{ scale: 1 - contentBlur.value * 0.02 }],
    };
  });

  useEffect(() => {
    // @ts-ignore - document is available on web
    if (typeof document !== 'undefined') {
      const handleKeyDown = (e: { key: string; metaKey: boolean; ctrlKey: boolean; preventDefault: () => void }) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsURLModalVisible((prev) => !prev);
        }
      };
      // @ts-ignore - document is available on web
      document.addEventListener('keydown', handleKeyDown, true);
      // @ts-ignore - document is available on web
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }
    return undefined;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <React.Suspense
          fallback={
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={Colors.loaderColor} />
            </View>
          }
        >
          <QRCodeDisplay />
        </React.Suspense>
      </Animated.View>
      <Panel onURLButtonPress={handleURLButtonPress} onMenuVisibilityChange={handleMenuVisibilityChange} />
      <URLInputModal visible={isURLModalVisible} onClose={handleURLModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
