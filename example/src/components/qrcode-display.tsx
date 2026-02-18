import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { PressableScale } from './pressable-scale';
import { useCopyQrCode } from './qrcode-copy-button/hooks/use-copy-qrcode';

export const QRCodeDisplay = () => {
  const copyQrCode = useCopyQrCode();

  return (
    <View style={styles.wrapper}>
      <PressableScale onPress={copyQrCode}>
        <WithSkiaWeb
          getComponent={() => import('./qrcode')}
          fallback={
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
            </View>
          }
        />
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
