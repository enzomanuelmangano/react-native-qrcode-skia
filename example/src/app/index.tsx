import 'react-native-reanimated';

import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'burnt/web';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../components/main';
import { Colors } from '../design-tokens';
import { Agentation } from 'agentation';

export default function Root() {
  return (
    <SafeAreaProvider>
      {process.env.NODE_ENV === 'development' && <Agentation />}
      <GestureHandlerRootView style={styles.fill}>
        <View style={styles.container}>
          <App />
        </View>
      </GestureHandlerRootView>
      <Toaster position="top-center" theme='dark' />
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
