import { useCallback } from 'react';
import * as Burnt from 'burnt';
import { Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useGetActiveQrCodeString } from './use-active-qrcode-string';
import { Image } from 'expo-image';
import { qrcodeState$ } from '../../../states';
// @ts-ignore TODO: fix this
import React from 'react';

const GitHubMark = require('../../../../assets/images/github-mark.png');

const IconStyle = { width: 18, height: 18 };

export const useCopyQrCode = () => {
  const getActiveQrCodeString = useGetActiveQrCodeString();

  const copyQrCode = useCallback(() => {
    Clipboard.setString(getActiveQrCodeString());

    // Trigger logo spin animation
    qrcodeState$.copyTrigger.set((prev) => prev + 1);

    if (Platform.OS === 'web') {
      // Burnt will fallback to Sonner on Web
      return Burnt.toast({
        title: 'QRCode Copied',
        message: "Don't forget to leave a star on GitHub!",
        duration: 2,
        shouldDismissByDrag: true,
        preset: 'custom',
        haptic: 'success',
        icon: {
          ios: {
            name: 'star.fill',
            color: '#000000',
          },
          web: (
            <Image source={GitHubMark} tintColor="#FFFFFF" style={IconStyle} contentFit="contain" />
          ),
        },
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
