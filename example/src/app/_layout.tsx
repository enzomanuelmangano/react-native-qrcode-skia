import 'react-native-reanimated';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Platform, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from '../utils/toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../design-tokens';

// Lazy load Agentation only on web in development (optional dependency)
const useAgentation = () => {
  const [AgentationComponent, setAgentationComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && process.env.NODE_ENV === 'development') {
      // @ts-ignore - agentation is an optional dev dependency
      import('agentation')
        .then((mod: { Agentation: React.ComponentType }) =>
          setAgentationComponent(() => mod.Agentation)
        )
        .catch(() => {
          // Agentation not installed, skip
        });
    }
  }, []);

  return AgentationComponent;
};

export default function RootLayout() {
  const Agentation = useAgentation();

  return (
    <SafeAreaProvider style={styles.fill}>
      {Agentation && <Agentation />}
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
