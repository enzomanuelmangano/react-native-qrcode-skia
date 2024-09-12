import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import 'react-native-reanimated';
import QRCodeDemo from '../components/qrcode';

const Padding = 25;

import { type BaseShapeOptions } from 'react-native-qrcode-skia';
import { ShapeSelector } from './shape-selector';
import { useAtom } from 'jotai';
import {
  BaseShapeAtom,
  EyePatternShapeAtom,
  BasePaddingAtom,
  EyePatternPaddingAtom,
} from '../states';
import { NumberSelector } from './number-selector';
import { Separator } from './separator';

const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

export default function App() {
  const [baseShape, setBaseShape] = useAtom(BaseShapeAtom);
  const [eyePatternShape, setEyePatternShape] = useAtom(EyePatternShapeAtom);
  const [basePadding, setBasePadding] = useAtom(BasePaddingAtom);
  const [eyePatternPadding, setEyePatternPadding] = useAtom(
    EyePatternPaddingAtom
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.codes}>
        <QRCodeDemo />
      </View>
      <View>
        <Text style={styles.label}>Base Shape</Text>
        <View style={styles.shapeSelector}>
          {Shapes.map((shape) => (
            <ShapeSelector
              key={shape}
              shape={shape}
              isActive={baseShape === shape}
              onPress={() => {
                setBaseShape(shape);
              }}
            />
          ))}
        </View>
        <Separator />
        <Text style={styles.label}>Eye Pattern Shapes</Text>
        <View style={styles.shapeSelector}>
          {Shapes.map((shape) => (
            <ShapeSelector
              key={shape}
              shape={shape}
              isActive={eyePatternShape === shape}
              onPress={() => {
                setEyePatternShape(shape);
              }}
            />
          ))}
        </View>
        <Separator />
        <Text style={styles.label}>Base Padding</Text>
        <NumberSelector
          max={4}
          min={0}
          value={basePadding}
          onChange={setBasePadding}
        />
        <Separator />
        <Text style={styles.label}>Eye Pattern Padding</Text>
        <NumberSelector
          max={4}
          min={0}
          value={eyePatternPadding}
          onChange={setEyePatternPadding}
        />
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
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 14,
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
    gap: 14,
  },
});
