import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  import('@shopify/react-native-skia/lib/module/web').then(({ LoadSkiaWeb }) => {
    LoadSkiaWeb({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}`,
    }).then(() => {
      renderRootComponent(App);
    });
  });
} else {
  renderRootComponent(App);
}
