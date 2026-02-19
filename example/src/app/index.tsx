import 'react-native-reanimated';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from '../utils/toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../components/main';
import { Colors } from '../design-tokens';

// Lazy load Agentation only in development (optional dependency)
const useAgentation = () => {
  const [AgentationComponent, setAgentationComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - agentation is an optional dev dependency
      import('agentation')
        .then((mod: { Agentation: React.ComponentType }) => setAgentationComponent(() => mod.Agentation))
        .catch(() => {
          // Agentation not installed, skip
        });
    }
  }, []);

  return AgentationComponent;
};

export default function Root() {
  const Agentation = useAgentation();

  return (
    <SafeAreaProvider>
      {Agentation && <Agentation />}
      <GestureHandlerRootView style={styles.fill}>
        <View style={styles.container}>
          <App />
        </View>
      </GestureHandlerRootView>
      <Toaster position="top-center" theme="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
