import { useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../../../states';
import { Themes } from '../../../constants';
import { getSkiaGradientStringByType } from '../../../utils/gradient';

const SponsorUrl = 'https://patreon.com/reactiive';
const QRCodeSize = 200;

export const useGetActiveQrCodeString = () => {
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const colors = [...Themes[currentThemeName].colors];

  const getActiveQrCodeString = useCallback(() => {
    const logoProps = (() => {
      if (!selectedLogo) {
        return '';
      }
      return `
      logoAreaSize={70}
      logo={
        <View style={{
          height: 50,
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 38 }}>${selectedLogo}</Text>
        </View>
      }`;
    })();

    const qrCodeComponent = `
    <QRCode
      value="${SponsorUrl}"
      size={${QRCodeSize}}
      shapeOptions={{
        shape: "${baseShape}",
        eyePatternShape: "${eyePatternShape}",
        eyePatternGap: ${gap},
        gap: ${gap}
      }}${logoProps}
    >
      ${getSkiaGradientStringByType({
        gradient: gradientType,
        size: QRCodeSize,
        colors,
      })}
    </QRCode>
`;

    return qrCodeComponent;
  }, [
    baseShape,
    eyePatternShape,
    gap,
    gradientType,
    colors,
    selectedLogo,
    currentThemeName,
  ]);

  return getActiveQrCodeString;
};
