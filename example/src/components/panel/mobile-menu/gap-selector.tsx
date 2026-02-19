import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapSizes } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';

export const GapSelector = () => {
  const currentGap = useSelector(qrcodeState$.gap);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentTheme];

  return (
    <View style={styles.gapRow}>
      {GapSizes.map((size) => {
        const isSelected = size === currentGap;
        return (
          <Pressable
            key={size}
            onPress={() => qrcodeState$.gap.set(size)}
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
