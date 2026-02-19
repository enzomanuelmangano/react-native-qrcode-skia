import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Panel } from './panel';
import { QRCodeDisplay } from './qrcode-display';
import { URLInputModal } from './url-input-modal';
import { Colors } from '../design-tokens';

const DRAWER_MAX_HEIGHT_PERCENT = 0.7;

export default function App() {
  const { height: windowHeight } = useWindowDimensions();
  const [isURLModalVisible, setIsURLModalVisible] = useState(false);
  const drawerProgress = useSharedValue(0);

  const handleURLButtonPress = useCallback(() => {
    setIsURLModalVisible(true);
  }, []);

  const handleURLModalClose = useCallback(() => {
    setIsURLModalVisible(false);
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Calculate translation to center QR code in visible area above drawer
    // Drawer takes up to 70% of screen, so visible area is 30%
    // Move content up by half the drawer height to center it in remaining space
    const translateY =
      (-drawerProgress.value * (windowHeight * DRAWER_MAX_HEIGHT_PERCENT)) / 2.8;
    const scale = 1 - drawerProgress.value * 0.02;

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  useEffect(() => {
    // @ts-ignore - document is available on web
    if (typeof document !== 'undefined') {
      const handleKeyDown = (e: {
        key: string;
        metaKey: boolean;
        ctrlKey: boolean;
        preventDefault: () => void;
      }) => {
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
      <StatusBar style="auto" />
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
      <Panel
        onURLButtonPress={handleURLButtonPress}
        drawerProgress={drawerProgress}
      />
      <URLInputModal
        visible={isURLModalVisible}
        onClose={handleURLModalClose}
      />
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
