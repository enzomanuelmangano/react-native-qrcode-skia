import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

export const QRCodeDisplay = () => {
  return (
    <View style={styles.wrapper}>
      <WithSkiaWeb
        getComponent={() => import('./qrcode')}
        fallback={
          <View style={styles.loader}>
            <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
          </View>
        }
      />
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
