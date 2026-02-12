import { useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import {
  qrcodeState$,
  filteredColors$,
} from '../../../states';
import { getSkiaGradientStringByType } from '../../gradient-option-preview/utils';

const SponsorUrl = 'https://patreon.com/reactiive';
const QRCodeSize = 200;

export const useGetActiveQrCodeString = () => {
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const baseGap = useSelector(qrcodeState$.baseGap);
  const eyePatternGap = useSelector(qrcodeState$.eyePatternGap);
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const colors = useSelector(filteredColors$);

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
        eyePatternGap: ${eyePatternGap},
        gap: ${baseGap}
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
    eyePatternGap,
    baseGap,
    gradientType,
    colors,
    selectedLogo,
  ]);

  return getActiveQrCodeString;
};
