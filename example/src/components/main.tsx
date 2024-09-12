import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import 'react-native-reanimated';
import QRCodeDemo from '../components/qrcode';

const Padding = 25;

import { type BaseShapeOptions } from 'react-native-qrcode-skia';
import { ShapeSelector } from './shape-selector';

const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.codes}>
        <QRCodeDemo />
      </View>
      <View style={styles.shapeSelector}>
        {Shapes.map((shape) => (
          <ShapeSelector key={shape} shape={shape} onPress={() => {}} />
        ))}
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
  shapeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
