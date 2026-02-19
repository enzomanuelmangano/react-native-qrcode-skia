import QRCode from 'react-native-qrcode-skia';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../states';
import { Themes } from '../constants';
import { getSkiaGradientByType } from '../utils/gradient';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const QRCodeSize = 220;

const SPRING_CONFIG = {
  mass: 1,
  stiffness: 80,
  damping: 12,
} as const;

const AnimatedLogo = ({ emoji }: { emoji: string }) => {
  const copyTrigger = useSelector(qrcodeState$.copyTrigger);
  const rotation = useSharedValue(0);
  const initialTrigger = React.useRef(copyTrigger);

  useEffect(() => {
    const diff = copyTrigger - initialTrigger.current;
    if (diff > 0) {
      // Only animate for triggers since mount
      rotation.value = withSpring(diff * 360, SPRING_CONFIG);
    }
  }, [copyTrigger, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.logo, animatedStyle]}>
      <Text style={styles.logoLabel}>{emoji}</Text>
    </Animated.View>
  );
};

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
      logo: <AnimatedLogo emoji={selectedLogo} />,
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
