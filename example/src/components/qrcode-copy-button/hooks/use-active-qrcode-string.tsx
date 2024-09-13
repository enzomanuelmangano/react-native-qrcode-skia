import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import {
  BaseShapeAtom,
  EyePatternShapeAtom,
  BaseGapAtom,
  EyePatternGapAtom,
  SelectedGradientAtom,
  SelectedLogoAtom,
  FilteredColorsAtom,
} from '../../../states';
import { getSkiaGradientStringByType } from '../../gradient-option-preview/utils';

const SponsorUrl = 'https://patreon.com/reactiive';
const QRCodeSize = 200;

export const useGetActiveQrCodeString = () => {
  const baseShape = useAtomValue(BaseShapeAtom);
  const eyePatternShape = useAtomValue(EyePatternShapeAtom);
  const baseGap = useAtomValue(BaseGapAtom);
  const eyePatternGap = useAtomValue(EyePatternGapAtom);
  const gradientType = useAtomValue(SelectedGradientAtom);
  const selectedLogo = useAtomValue(SelectedLogoAtom);
  const colors = useAtomValue(FilteredColorsAtom);

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
