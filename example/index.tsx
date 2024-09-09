import '@expo/metro-runtime';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import App from './app/web-entry';

LoadSkiaWeb().then(async () => {
  registerRootComponent(App);
});
