import { ScrollView, StyleSheet, View } from 'react-native';

import React from 'react';
import {
  BasePaddingSelector,
  BaseShapeSelector,
  EyePatternPaddingSelector,
  EyePatternShapeSelector,
  GradientSelector,
  LogoSelector,
  LogoBorderRadiusSelector,
} from './selectors';

export const ConfigPanel = () => {
  return (
    <ScrollView style={styles.container}>
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
          <View>
            <LogoBorderRadiusSelector />
          </View>
        </View>
        <GradientSelector />
        <LogoSelector />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    maxHeight: 650,
  },
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
