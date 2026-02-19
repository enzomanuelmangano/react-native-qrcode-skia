import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { Skia } from '@shopify/react-native-skia';
import * as Burnt from 'burnt';
import { qrcodeState$, GapValues } from '../../../states';
import { Themes } from '../../../constants';
// Using relative path to library source
import { generateMatrix } from '../../../../../src/qrcode/generate-matrix';
import { transformMatrixIntoPath } from '../../../../../src/qrcode/transform-matrix-into-path';

const ExportSize = 1024;
const Padding = 128;

const LogoAreaSize = 70; // Same as in qrcode.tsx
const LogoExportScale = ExportSize / 220; // Scale factor from display size to export size

export const useExportQrCodeImage = () => {
  const qrUrl = useSelector(qrcodeState$.qrUrl);
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);

  const exportQrCodeImage = useCallback(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    try {
      const totalSize = ExportSize + Padding * 2;

      // Create offscreen surface
      const surface = Skia.Surface.MakeOffscreen(totalSize, totalSize);
      if (!surface) {
        throw new Error('Could not create offscreen surface');
      }

      const canvas = surface.getCanvas();

      // Clear to transparent
      canvas.clear(Skia.Color('transparent'));

      // Generate QR code path
      const value = qrUrl || ':)';
      const matrix = generateMatrix(value, 'H');
      const scaledLogoAreaSize = selectedLogo ? LogoAreaSize * LogoExportScale : 0;
      const pathData = transformMatrixIntoPath(
        matrix,
        ExportSize,
        {
          shape: baseShape,
          eyePatternShape: eyePatternShape,
          gap: gap,
          eyePatternGap: gap,
        },
        scaledLogoAreaSize
      );

      const path = Skia.Path.MakeFromSVGString(pathData.path);
      if (!path) {
        throw new Error('Could not create path');
      }

      // Create gradient paint
      const paint = Skia.Paint();
      const colors = theme.colors.map((c: string) => Skia.Color(c));
      const center = totalSize / 2;

      let shader;
      switch (gradientType) {
        case 'radial':
          shader = Skia.Shader.MakeRadialGradient(
            { x: center, y: center },
            ExportSize / 2,
            colors,
            null,
            0
          );
          break;
        case 'linear':
          shader = Skia.Shader.MakeLinearGradient(
            { x: Padding, y: center },
            { x: Padding + ExportSize, y: center },
            colors,
            null,
            0
          );
          break;
        case 'linear-vertical':
          shader = Skia.Shader.MakeLinearGradient(
            { x: center, y: Padding },
            { x: center, y: Padding + ExportSize },
            colors,
            null,
            0
          );
          break;
        case 'sweep':
          shader = Skia.Shader.MakeSweepGradient(center, center, colors, null, 0);
          break;
        case 'conical':
          shader = Skia.Shader.MakeTwoPointConicalGradient(
            { x: center, y: center },
            0,
            { x: center, y: center },
            ExportSize / 2,
            colors,
            null,
            0
          );
          break;
        default:
          shader = Skia.Shader.MakeLinearGradient(
            { x: Padding, y: center },
            { x: Padding + ExportSize, y: center },
            colors,
            null,
            0
          );
      }

      paint.setShader(shader);

      // Draw QR code with padding offset
      canvas.save();
      canvas.translate(Padding, Padding);
      canvas.drawPath(path, paint);
      canvas.restore();

      // Draw logo emoji if selected (using 2D canvas workaround for web)
      if (selectedLogo) {
        const fontSize = Math.round(38 * LogoExportScale);
        const emojiSize = Math.round(fontSize * 1.2);

        // Create a temporary 2D canvas to render the emoji
        // @ts-ignore - DOM API for web
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = emojiSize;
        tempCanvas.height = emojiSize;
        // @ts-ignore
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          // @ts-ignore
          tempCtx.font = `${fontSize}px sans-serif`;
          // @ts-ignore
          tempCtx.textAlign = 'center';
          // @ts-ignore
          tempCtx.textBaseline = 'middle';
          // @ts-ignore
          tempCtx.fillText(selectedLogo, emojiSize / 2, emojiSize / 2);

          // Convert to data URL and create Skia image
          // @ts-ignore
          const dataUrl = tempCanvas.toDataURL('image/png');
          const base64 = dataUrl.split(',')[1];
          const skData = Skia.Data.fromBase64(base64);
          const emojiImage = Skia.Image.MakeImageFromEncoded(skData);

          if (emojiImage) {
            const x = center - emojiSize / 2;
            const y = center - emojiSize / 2;
            canvas.drawImage(emojiImage, x, y);
          }
        }
      }

      // Get image snapshot and encode
      const image = surface.makeImageSnapshot();
      const data = image.encodeToBase64();

      // Trigger download
      // @ts-ignore - DOM API for web
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${data}`;
      link.download = 'qrcode.png';
      link.click();

      Burnt.toast({
        title: 'QR Code Exported',
        message: 'Image saved to downloads',
        preset: 'done',
        duration: 2,
      });
    } catch (error) {
      console.error('Export error:', error);
      Burnt.toast({
        title: 'Export Failed',
        message: String(error),
        preset: 'error',
        duration: 2,
      });
    }
  }, [qrUrl, baseShape, eyePatternShape, gap, gradientType, theme.colors, selectedLogo]);

  return exportQrCodeImage;
};
