import '@expo/metro-runtime';
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import App from './src/app/main';

LoadSkiaWeb().then(async () => {
  registerRootComponent(App);
});
