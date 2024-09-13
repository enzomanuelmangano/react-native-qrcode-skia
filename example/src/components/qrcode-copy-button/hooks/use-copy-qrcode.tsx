import * as Clipboard from 'expo-clipboard';
import { useCallback } from 'react';

import * as Burnt from 'burnt';
import { Platform } from 'react-native';

export const useCopyQrCode = () => {
  const copyQrCode = useCallback(async () => {
    await Clipboard.setStringAsync('hello world');

    if (Platform.OS === 'web') {
      // Burnt will fallback to Sonner on Web
      return Burnt.toast({
        title: 'QR code copied',
        shouldDismissByDrag: true,
        preset: 'done',
      });
    }

    // TODO:
    // Need to check for Expo Go
  }, []);

  return copyQrCode;
};
