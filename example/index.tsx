import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  import('@shopify/react-native-skia/lib/module/web').then(({ LoadSkiaWeb }) => {
    LoadSkiaWeb({
      // Served from public/ (copied by `setup-skia-web` on install), so it
      // always matches the CanvasKit version of the installed Skia.
      locateFile: (file: string) => `/${file}`,
    }).then(() => {
      renderRootComponent(App);
    });
  });
} else {
  renderRootComponent(App);
}
