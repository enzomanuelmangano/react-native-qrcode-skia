import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Burnt from 'burnt';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapSizes, type GapSize } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';

export const GapSelector = () => {
  const currentGap = useSelector(qrcodeState$.gap);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentTheme];

  const handleSelect = useCallback((size: GapSize) => {
    if (size === qrcodeState$.gap.peek()) return;
    qrcodeState$.gap.set(size);
    Burnt.toast({
      title: `Gap: ${size.toUpperCase()}`,
      preset: 'done',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.gapRow}>
      {GapSizes.map((size) => {
        const isSelected = size === currentGap;
        return (
          <Pressable
            key={size}
            onPress={() => handleSelect(size)}
            style={[
              styles.gapOption,
              isSelected && { backgroundColor: theme.colors[0] },
            ]}
          >
            <Text style={[styles.gapText, isSelected && styles.gapTextSelected]}>
              {size}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
