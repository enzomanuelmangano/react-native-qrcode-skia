import 'react-native-reanimated';

import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <React.Suspense>
      <GestureHandlerRootView style={styles.container}>
        <WithSkiaWeb
          getComponent={async () => {
            return require('../components/main');
          }}
          fallback={<View style={styles.container} />}
        />
      </GestureHandlerRootView>
    </React.Suspense>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'blue' },
});
