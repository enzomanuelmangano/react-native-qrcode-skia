import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../states';
import { Themes } from '../constants';

export const QRCodeDisplay = () => {
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];

  return (
    <View style={styles.wrapper}>
      {/* Soft glow effect */}
      <LinearGradient
        colors={[`${theme.colors[0]}40`, `${theme.colors[1]}20`, 'transparent']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />

      {/* QR Code */}
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 600,
    height: 600,
    opacity: 0.6,
  },
  loader: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
