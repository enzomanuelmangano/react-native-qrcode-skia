import QRCode from 'react-native-qrcode-skia';
import React, { useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../states';
import { Themes } from '../constants';
import { getSkiaGradientByType } from '../utils/gradient';
import { StyleSheet, Text, View } from 'react-native';

const QRCodeSize = 220;

function QRCodeDemo() {
  const qrUrl = useSelector(qrcodeState$.qrUrl);
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];

  const gradientComponent = useMemo(
    () =>
      getSkiaGradientByType({
        gradient: gradientType,
        colors: [...theme.colors],
        size: QRCodeSize,
      }),
    [gradientType, theme.colors]
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
    <QRCode
      value={qrUrl || ':)'}
      size={QRCodeSize}
      shapeOptions={{
        shape: baseShape,
        gap: gap,
        eyePatternGap: gap,
        eyePatternShape: eyePatternShape,
      }}
      {...logoProps}
    >
      {gradientComponent}
    </QRCode>
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
