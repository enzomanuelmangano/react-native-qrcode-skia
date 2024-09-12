import QRCode from 'react-native-qrcode-skia';
import React from 'react';
import {
  Blend,
  RadialGradient,
  Turbulence,
  vec,
} from '@shopify/react-native-skia';
import { useAtomValue } from 'jotai';
import {
  BaseShapeAtom,
  EyePatternShapeAtom,
  BasePaddingAtom,
  EyePatternPaddingAtom,
} from '../states';

const SponsorUrl = 'https://patreon.com/reactiive';

const QRCodeSize = 200;

function QRCodeDemo() {
  const baseShape = useAtomValue(BaseShapeAtom);
  const eyePatternShape = useAtomValue(EyePatternShapeAtom);
  const basePadding = useAtomValue(BasePaddingAtom);
  const eyePatternPadding = useAtomValue(EyePatternPaddingAtom);

  return (
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
      <Blend mode="colorBurn">
        <RadialGradient
          r={128}
          c={vec(QRCodeSize / 2, QRCodeSize / 2)}
          colors={['magenta', 'yellow']}
        />
        <Turbulence freqX={0.01} freqY={0.05} octaves={4} />
      </Blend>
    </QRCode>
  );
}

export default QRCodeDemo;
