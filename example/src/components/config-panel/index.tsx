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
      <EyePatternShapeSelector />
      <BaseShapeSelector />
      <View style={{ flexDirection: 'row' }}>
        <View>
          <EyePatternPaddingSelector />
        </View>
        <View style={{ flex: 1 }} />
        <View>
          <BasePaddingSelector />
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <GradientSelector />
      <LogoSelector />
    </View>
  );
};
