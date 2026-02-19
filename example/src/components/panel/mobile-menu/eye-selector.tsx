import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, Shapes } from '../../../states';
import { Themes } from '../../../constants';
import { getPathFromShape } from '../../../utils/shape-path';
import { Colors } from '../../../design-tokens';
import { styles } from './styles';

export const EyeSelector = () => {
  const currentShape = useSelector(qrcodeState$.eyePatternShape);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];

  return (
    <View style={styles.optionsRow}>
      {Shapes.map((shape) => {
        const isSelected = shape === currentShape;
        const shapePath = getPathFromShape(shape, 16);
        return (
          <Pressable
            key={shape}
            onPress={() => qrcodeState$.eyePatternShape.set(shape)}
            style={[styles.shapeOption, isSelected && { backgroundColor: themeColor }]}
          >
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path d={shapePath} fill={Colors.textPrimary} />
            </Svg>
          </Pressable>
        );
      })}
    </View>
  );
};
