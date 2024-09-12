import QRCode from 'react-native-qrcode-skia';
import React from 'react';
import {
  Blend,
  RadialGradient,
  Turbulence,
  vec,
} from '@shopify/react-native-skia';

const SponsorUrl = 'https://patreon.com/reactiive';

function QRCodeDemo() {
  return (
    <QRCode
      value={SponsorUrl}
      size={200}
      shapeOptions={{
        shape: 'circle',
        detectionPatternPadding: 1,
        internalPadding: 1,
        detectionPatternShape: 'square',
        cornerRadius: 10,
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
