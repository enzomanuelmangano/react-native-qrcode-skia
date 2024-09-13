import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ShapeOptionPreview } from '../shape-option-preview';
import { Separator } from '../separator';
import { useAtom } from 'jotai';
import {
  BasePaddingAtom,
  BaseShapeAtom,
  EyePatternPaddingAtom,
  EyePatternShapeAtom,
  GradientTypeOptions,
  LogoEmojis,
  SelectedGradientAtom,
  SelectedLogoAtom,
} from '../../states';
import React from 'react';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { GradientOptionPreview } from '../gradient-option-preview';
import { NumberOptionPreview } from '../number-option-preview';
import { LogoOptionPreview } from '../logo-option-preview';

const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

const Padding = 25;

export const ConfigPanel = () => {
  const [baseShape, setBaseShape] = useAtom(BaseShapeAtom);
  const [eyePatternShape, setEyePatternShape] = useAtom(EyePatternShapeAtom);
  const [basePadding, setBasePadding] = useAtom(BasePaddingAtom);
  const [eyePatternPadding, setEyePatternPadding] = useAtom(
    EyePatternPaddingAtom
  );
  const [gradientType, setGradientType] = useAtom(SelectedGradientAtom);
  const [selectedLogo, setSelectedLogo] = useAtom(SelectedLogoAtom);
  const { width: windowWidth } = useWindowDimensions();

  const listStyle = {
    minWidth: windowWidth - Padding,
    maxWidth: windowWidth - Padding,
  };

  return (
    <View>
      <Text style={styles.label}>Base Shape</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={listStyle}
        contentContainerStyle={styles.selector}
      >
        {Shapes.map((shape) => (
          <ShapeOptionPreview
            key={shape}
            shape={shape}
            isActive={baseShape === shape}
            onPress={() => {
              setBaseShape(shape);
            }}
          />
        ))}
      </ScrollView>
      <Separator />
      <Text style={styles.label}>Eye Pattern Shapes</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={listStyle}
        contentContainerStyle={styles.selector}
      >
        {Shapes.map((shape) => (
          <ShapeOptionPreview
            key={shape}
            shape={shape}
            isActive={eyePatternShape === shape}
            onPress={() => {
              setEyePatternShape(shape);
            }}
          />
        ))}
      </ScrollView>
      <Separator />

      <Text style={styles.label}>Base Padding</Text>
      <NumberOptionPreview
        max={4}
        min={0}
        value={basePadding}
        onChange={setBasePadding}
        style={listStyle}
      />
      <Separator />
      <Text style={styles.label}>Eye Pattern Padding</Text>
      <NumberOptionPreview
        style={listStyle}
        max={4}
        min={0}
        value={eyePatternPadding}
        onChange={setEyePatternPadding}
      />
      <Separator />
      <Text style={styles.label}>Gradient</Text>
      <ScrollView
        horizontal
        style={listStyle}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selector}
      >
        {GradientTypeOptions.map((gradient) => (
          <GradientOptionPreview
            key={gradient}
            type={gradient}
            onPress={() => {
              setGradientType(gradient);
            }}
            isActive={gradientType === gradient}
          />
        ))}
      </ScrollView>
      <Separator />
      <Text style={styles.label}>Logo</Text>
      <ScrollView
        horizontal
        style={listStyle}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selector}
      >
        {LogoEmojis.map((logo) => (
          <LogoOptionPreview
            key={logo}
            isActive={selectedLogo === logo}
            onPress={() => {
              setSelectedLogo(logo);
            }}
            logoEmoji={logo}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: 2,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  selector: {
    gap: 14,
  },
});
