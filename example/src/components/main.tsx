import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import 'react-native-reanimated';
import QRCodeDemo from '../components/qrcode';

import { ConfigPanel } from './config-panel';
import { QrCodeCopyButton } from './qrcode-copy-button';
import useDimensions from '../hooks/useDimensions';

export default function App() {
  const { isLessThan } = useDimensions();

  if (isLessThan('xl')) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <StatusBar style="light" hidden />
        <View style={styles.qrCodeContainer}>
          <QRCodeDemo />
          <QrCodeCopyButton />
        </View>
        <ConfigPanel />
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
        ...styles.smallContainer,
      }}
    >
      <StatusBar style="light" hidden />
      <View style={styles.fillCenter}>
        <ConfigPanel />
      </View>
      <View style={styles.fillCenter}>
        <View style={styles.qrCodeContainer}>
          <QRCodeDemo />
          <QrCodeCopyButton />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  smallContainer: { flex: 1, flexDirection: 'row', paddingHorizontal: 40 },
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
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
