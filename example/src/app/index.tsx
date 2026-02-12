import 'react-native-reanimated';

import * as React from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'burnt/web';
import { FontsProvider } from '../providers/fonts-provider';
import { GitHubBanner } from '../components/github-banner';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <React.Suspense>
      <SafeAreaProvider>
        <FontsProvider>
          <GestureHandlerRootView style={styles.fill}>
            <WithSkiaWeb
              getComponent={async () => {
                return require('../components/main');
              }}
              fallback={
                <View style={styles.container}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              }
            />
          </GestureHandlerRootView>
        </FontsProvider>
        <GitHubBanner />
        <Toaster position="bottom-right" />
      </SafeAreaProvider>
    </React.Suspense>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
