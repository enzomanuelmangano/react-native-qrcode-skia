import 'react-native-reanimated';

import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

export default function App() {
  return (
    <React.Suspense>
      <WithSkiaWeb
        getComponent={async () => {
          return require('../components/main');
        }}
        fallback={<View style={styles.container} />}
      />
    </React.Suspense>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'blue' },
});
