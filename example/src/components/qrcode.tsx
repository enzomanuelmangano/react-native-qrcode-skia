import QRCode from 'react-native-qrcode-skia';
import React, { useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import {
  qrcodeState$,
  useRandomColors,
} from '../states';
import { getSkiaGradientByType } from './gradient-option-preview';
import { PressableScale } from './pressable-scale';
import { StyleSheet, Text, View } from 'react-native';

const SponsorUrl = 'https://patreon.com/reactiive';

const QRCodeSize = 200;

function QRCodeDemo() {
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const baseGap = useSelector(qrcodeState$.baseGap);
  const eyePatternGap = useSelector(qrcodeState$.eyePatternGap);
  const gradientType = useSelector(qrcodeState$.selectedGradient);
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

  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
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
