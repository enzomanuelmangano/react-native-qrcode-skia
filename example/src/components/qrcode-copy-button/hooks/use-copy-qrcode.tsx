import { useCallback } from 'react';
import * as Burnt from 'burnt';
import { Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { useGetActiveQrCodeString } from './use-active-qrcode-string';

export const useCopyQrCode = () => {
  const getActiveQrCodeString = useGetActiveQrCodeString();

  const copyQrCode = useCallback(() => {
    Clipboard.setString(getActiveQrCodeString());

    if (Platform.OS === 'web') {
      // Burnt will fallback to Sonner on Web
      return Burnt.toast({
        title: 'QR code component copied',
        shouldDismissByDrag: true,
        preset: 'done',
      });
    }

    // TODO: handle native platforms if != Expo Go
    // Burnt.toast({
    //   title: 'QR code component copied',
    //   preset: 'done',
    // });
  }, [getActiveQrCodeString]);

  return copyQrCode;
};
