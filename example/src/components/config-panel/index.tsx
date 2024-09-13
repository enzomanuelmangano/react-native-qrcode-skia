import { View } from 'react-native';

import React from 'react';
import {
  BasePaddingSelector,
  BaseShapeSelector,
  EyePatternPaddingSelector,
  EyePatternShapeSelector,
  GradientSelector,
  LogoSelector,
} from './selectors';

export const ConfigPanel = () => {
  return (
    <View>
      <BaseShapeSelector />
      <EyePatternShapeSelector />
      <BasePaddingSelector />
      <EyePatternPaddingSelector />
      <GradientSelector />
      <LogoSelector />
    </View>
  );
};
