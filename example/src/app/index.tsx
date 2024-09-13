import 'react-native-reanimated';

import * as React from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <React.Suspense>
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
    </React.Suspense>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
