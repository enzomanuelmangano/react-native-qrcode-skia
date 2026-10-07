import 'react-native-reanimated';
import '../styles/global.css';

import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from '../utils/toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../design-tokens';

export default function RootLayout() {
  return (
    <SafeAreaProvider style={styles.fill}>
      <GestureHandlerRootView style={styles.fill}>
        <Slot />
      </GestureHandlerRootView>
      {Platform.OS === 'web' && <Toaster position="top-center" theme="dark" />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
