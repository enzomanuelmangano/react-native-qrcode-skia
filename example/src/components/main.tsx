import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import 'react-native-reanimated';
import QRCodeDemo from './qrcode';
import { Panel } from './panel';
import { theme } from '../theme';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.content}>
        <QRCodeDemo />
      </View>
      <Panel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
});
