import { useWindowDimensions, View } from 'react-native';
import { ShapeOptionPreview } from '../shape-option-preview';
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
import { SelectorSection } from './selector-section';

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
      <SelectorSection
        label="Base Shape"
        data={Shapes}
        renderItem={(shape) => (
          <ShapeOptionPreview
            shape={shape}
            isActive={baseShape === shape}
            onPress={() => setBaseShape(shape)}
          />
        )}
      />

      <SelectorSection
        label="Eye Pattern Shapes"
        data={Shapes}
        renderItem={(shape) => (
          <ShapeOptionPreview
            shape={shape}
            isActive={eyePatternShape === shape}
            onPress={() => setEyePatternShape(shape)}
          />
        )}
      />

      <SelectorSection
        label="Base Padding"
        customContent={
          <NumberOptionPreview
            max={4}
            min={0}
            value={basePadding}
            onChange={setBasePadding}
            style={listStyle}
          />
        }
      />

      <SelectorSection
        label="Eye Pattern Padding"
        customContent={
          <NumberOptionPreview
            style={listStyle}
            max={4}
            min={0}
            value={eyePatternPadding}
            onChange={setEyePatternPadding}
          />
        }
      />

      <SelectorSection
        label="Gradient"
        data={GradientTypeOptions}
        renderItem={(gradient) => (
          <GradientOptionPreview
            type={gradient}
            onPress={() => setGradientType(gradient)}
            isActive={gradientType === gradient}
          />
        )}
      />

      <SelectorSection
        label="Logo"
        data={LogoEmojis}
        renderItem={(logo) => (
          <LogoOptionPreview
            isActive={selectedLogo === logo}
            onPress={() => setSelectedLogo(logo)}
            logoEmoji={logo}
          />
        )}
      />
    </View>
  );
};
