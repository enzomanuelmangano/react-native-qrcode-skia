import { ScrollView, StyleSheet, View } from 'react-native';

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
    <ScrollView
      style={{
        overflow: 'visible',
        maxHeight: 650,
      }}
    >
      <View>
        <EyePatternShapeSelector />
        <BaseShapeSelector />
        <View style={styles.row}>
          <View>
            <EyePatternPaddingSelector />
          </View>
          <View style={styles.fill} />
          <View>
            <BasePaddingSelector />
          </View>
          <View style={styles.fill} />
        </View>
        <GradientSelector />
        <LogoSelector />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    maxHeight: 650,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
});
