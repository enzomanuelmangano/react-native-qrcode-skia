import QRCode from 'react-native-qrcode-skia';
import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import {
  BaseShapeAtom,
  EyePatternShapeAtom,
  BasePaddingAtom,
  EyePatternPaddingAtom,
  SelectedGradientAtom,
  useRandomColors,
} from '../states';
import { getSkiaGradientByType } from './gradient-selector/utils';
import { TouchableOpacity } from 'react-native';

const SponsorUrl = 'https://patreon.com/reactiive';

const QRCodeSize = 200;

function QRCodeDemo() {
  const baseShape = useAtomValue(BaseShapeAtom);
  const eyePatternShape = useAtomValue(EyePatternShapeAtom);
  const basePadding = useAtomValue(BasePaddingAtom);
  const eyePatternPadding = useAtomValue(EyePatternPaddingAtom);
  const gradientType = useAtomValue(SelectedGradientAtom);
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

  return (
    <TouchableOpacity onPress={generateColors}>
      <QRCode
        value={SponsorUrl}
        size={QRCodeSize}
        shapeOptions={{
          shape: baseShape,
          detectionPatternPadding: eyePatternPadding,
          internalPadding: basePadding,
          detectionPatternShape: eyePatternShape,
        }}
      >
        {gradientComponent}
      </QRCode>
    </TouchableOpacity>
  );
}

export default QRCodeDemo;
