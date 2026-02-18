import 'react-native-reanimated';

import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'burnt/web';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../components/main';
import { GitHubBanner } from '../components/github-banner';

export default function Root() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.fill}>
        <View style={styles.container}>
          <App />
        </View>
      </GestureHandlerRootView>
      <GitHubBanner />
      <Toaster position="bottom-right" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
