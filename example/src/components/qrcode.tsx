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

function QRCodeDemo() {
  const baseShape = useAtomValue(BaseShapeAtom);
  const eyePatternShape = useAtomValue(EyePatternShapeAtom);
  const basePadding = useAtomValue(BasePaddingAtom);
  const eyePatternPadding = useAtomValue(EyePatternPaddingAtom);

  return (
    <QRCode
      value={SponsorUrl}
      size={200}
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
          c={vec(100, 100)}
          colors={['magenta', 'yellow']}
        />
        <Turbulence freqX={0.01} freqY={0.05} octaves={4} />
      </Blend>
    </QRCode>
  );
}

export default QRCodeDemo;
