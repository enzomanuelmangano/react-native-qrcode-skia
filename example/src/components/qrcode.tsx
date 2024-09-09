import QRCode from 'react-native-qrcode-skia';
import React from 'react';
import {
  Blend,
  DiscretePathEffect,
  RadialGradient,
  Turbulence,
  vec,
} from '@shopify/react-native-skia';

function QRCodeDemo() {
  return (
    <QRCode
      value={'blabla.com'}
      size={200}
      shapeOptions={{
        shape: 'circle',
        detectionPatternPadding: 1,
        internalPadding: 1,
        detectionPatternShape: 'circle',
        cornerRadius: 10,
      }}
    >
      <DiscretePathEffect length={10} deviation={2} />
      <Blend mode="difference">
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
