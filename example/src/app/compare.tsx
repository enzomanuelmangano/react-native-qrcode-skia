import * as React from 'react';
import { Redirect } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient, vec } from '@shopify/react-native-skia';
import { baseline, current } from '../bench/impls';
import type { QRCodeProps } from 'react-native-qrcode-skia';

// Visual comparison screen (not part of the app): each row renders the same
// QR code with the original implementation (left) and the current one (right).

const SIZE = 120;

const CASES: (Omit<QRCodeProps, 'size'> & { label: string })[] = [
  { label: 'rounded (default)', value: 'https://qrcode.reactiive.io' },
  {
    label: 'circle + logo',
    value: 'https://github.com/enzomanuelmangano/react-native-qrcode-skia',
    shapeOptions: { shape: 'circle', eyePatternShape: 'rounded' },
    logo: <Text>🐨</Text>,
    logoAreaSize: 40,
    logoAreaBorderRadius: 12,
  },
  {
    label: 'square, gaps',
    value: 'WIFI:S:My Network;T:WPA;P:p@ss;;',
    shapeOptions: { shape: 'square', gap: 1, eyePatternGap: 1.5 },
  },
  {
    label: 'diamond / triangle',
    value: 'mailto:hello@reactiive.io?subject=Hi 123',
    shapeOptions: { shape: 'diamond', eyePatternShape: 'triangle' },
    errorCorrectionLevel: 'M',
  },
  {
    label: 'star, stroke',
    value: 'HTTPS://QRCODE.REACTIIVE.IO/ABC123',
    shapeOptions: { shape: 'star', eyePatternShape: 'circle' },
    pathStyle: 'stroke',
    strokeWidth: 0.6,
  },
  {
    label: 'gradient children',
    value: 'àèé€漢字テスト🐨 0123456789 ABC',
    errorCorrectionLevel: 'L',
    children: (
      <LinearGradient
        start={vec(0, 0)}
        end={vec(SIZE, SIZE)}
        colors={['#4a90d9', '#d94a8c']}
      />
    ),
  },
];

function Compare() {
  return (
    <View style={styles.root}>
      {CASES.map(({ label, ...props }) => (
        <View key={label} style={styles.row}>
          <baseline.QRCode {...props} size={SIZE} color="#fff" />
          <current.QRCode {...props} size={SIZE} color="#fff" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', paddingTop: 125 },
  // Integer point offsets: a view at a fractional pixel position is resampled
  // when composited, which would make identical canvases differ.
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    gap: 40,
    height: SIZE,
  },
});

// Development tool for native builds: not served on the website.
export default function Screen() {
  return Platform.OS === 'web' ? <Redirect href="/" /> : <Compare />;
}
