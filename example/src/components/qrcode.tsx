import QRCode from 'react-native-qrcode-skia';
import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import {
  BaseShapeAtom,
  EyePatternShapeAtom,
  BaseGapAtom,
  EyePatternGapAtom,
  SelectedGradientAtom,
  useRandomColors,
  SelectedLogoAtom,
  LogoAreaBorderRadiusAtom,
} from '../states';
import { getSkiaGradientByType } from './gradient-option-preview';
import { PressableScale } from './pressable-scale';
import { StyleSheet, Text, View } from 'react-native';

const SponsorUrl = 'https://patreon.com/reactiive';

const QRCodeSize = 200;

function QRCodeDemo() {
  const baseShape = useAtomValue(BaseShapeAtom);
  const eyePatternShape = useAtomValue(EyePatternShapeAtom);
  const baseGap = useAtomValue(BaseGapAtom);
  const eyePatternGap = useAtomValue(EyePatternGapAtom);
  const gradientType = useAtomValue(SelectedGradientAtom);
  const logoAreaBorderRadius = useAtomValue(LogoAreaBorderRadiusAtom);
  const { colors, generateColors } = useRandomColors();

  const gradientComponent = useMemo(
    () =>
      getSkiaGradientByType({
        gradient: gradientType,
        colors,
        size: QRCodeSize,
      }),
    [gradientType, colors]
  );

  const selectedLogo = useAtomValue(SelectedLogoAtom);
  const logoProps = useMemo(() => {
    if (!selectedLogo) {
      return {};
    }
    return {
      logo: (
        <View style={styles.logo}>
          <Text style={styles.logoLabel}>{selectedLogo}</Text>
        </View>
      ),
      logoAreaSize: 70,
    };
  }, [selectedLogo]);

  return (
    <PressableScale onPress={generateColors}>
      <QRCode
        value={SponsorUrl}
        size={QRCodeSize}
        shapeOptions={{
          shape: baseShape,
          gap: baseGap,
          eyePatternGap: eyePatternGap,
          eyePatternShape: eyePatternShape,
          logoAreaBorderRadius: logoAreaBorderRadius,
        }}
        {...logoProps}
      >
        {gradientComponent}
      </QRCode>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLabel: {
    fontSize: 38,
  },
});

export default QRCodeDemo;
