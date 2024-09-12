import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import 'react-native-reanimated';
import QRCodeDemo from '../components/qrcode';

import { ConfigPanel } from './config-panel';

export default function App() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="light" hidden />
      <View style={styles.qrCodeContainer}>
        <QRCodeDemo />
      </View>
      <ConfigPanel />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  qrCodeContainer: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 200,
  },
});
