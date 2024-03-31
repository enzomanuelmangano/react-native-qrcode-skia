import {
  BlurMask,
  DashPathEffect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-skia';

const SPONSOR_URL = 'https://patreon.com/reactiive';

const QRCodeSize = 190;
const center = vec(QRCodeSize / 2, QRCodeSize / 2);

const Padding = 25;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.codeContainer}>
        <QRCode
          value={SPONSOR_URL}
          size={QRCodeSize}
          strokeWidthPercentage={0.65}
        >
          <SweepGradient
            c={center}
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
          <BlurMask blur={2} style={'solid'} />
          <DashPathEffect intervals={[3.07, 3.85]} />
        </QRCode>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  codeContainer: {
    backgroundColor: '#080808',
    padding: Padding,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 100,
    borderRadius: 5,
    elevation: 5,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
