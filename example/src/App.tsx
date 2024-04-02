import {
  Blend,
  BlurMask,
  DashPathEffect,
  DiscretePathEffect,
  RadialGradient,
  SweepGradient,
  Turbulence,
  vec,
} from '@shopify/react-native-skia';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-skia';

const SPONSOR_URL = 'https://patreon.com/reactiive';

const QRCodeSize = 140;
const center = vec(QRCodeSize / 2, QRCodeSize / 2);

const Padding = 25;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.codes}>
        <View style={styles.codeContainer}>
          <QRCode value={SPONSOR_URL} size={QRCodeSize} pathColor="#FFFFFF" />
        </View>
        <View style={styles.codeContainer}>
          <QRCode value={SPONSOR_URL} size={QRCodeSize} strokeWidth={0.7}>
            <SweepGradient
              c={center}
              colors={['cyan', 'magenta', 'yellow', 'cyan']}
            />
            <BlurMask blur={1} style={'solid'} />
            <DashPathEffect intervals={[3.5, 0.5]} />
          </QRCode>
        </View>
        <View style={styles.codeContainer}>
          <QRCode value={SPONSOR_URL} size={QRCodeSize}>
            <DiscretePathEffect length={10} deviation={2} />
            <Blend mode="difference">
              <RadialGradient
                r={128}
                c={center}
                colors={['magenta', 'yellow']}
              />
              <Turbulence freqX={0.01} freqY={0.05} octaves={4} />
            </Blend>
          </QRCode>
        </View>
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
    paddingVertical: 100,
  },
  codes: { flex: 1, justifyContent: 'space-around' },
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
