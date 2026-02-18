import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { Panel } from './panel';
import { QRCodeDisplay } from './qrcode-display';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.content}>
        <React.Suspense
          fallback={
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="rgba(255,255,255,0.3)" />
            </View>
          }
        >
          <QRCodeDisplay />
        </React.Suspense>
      </View>
      <Panel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
