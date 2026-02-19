import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import type { Observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Shapes } from '../../states';
import { HoverDropdown } from './hover-dropdown';
import { getPathFromShape } from '../../utils/shape-path';
import { Colors, Spacing, Sizes } from '../../design-tokens';

type EyeDropdownProps = {
  value$: Observable<BaseShapeOptions>;
};

export const EyeDropdown = ({ value$ }: EyeDropdownProps) => {
  const value = useSelector(value$);
  const shapePath = useMemo(
    () => getPathFromShape(value, Sizes.shapePreview),
    [value]
  );

  return (
    <HoverDropdown
      label="Eye"
      trigger={
        <View style={styles.triggerPreview}>
          <Svg
            width={Sizes.shapePreview}
            height={Sizes.shapePreview}
            viewBox={`0 0 ${Sizes.shapePreview} ${Sizes.shapePreview}`}
          >
            <Path d={shapePath} fill="white" />
          </Svg>
        </View>
      }
    >
      {Shapes.map((shape) => (
        <EyeOption
          key={shape}
          shape={shape}
          isSelected={value === shape}
          onSelect={() => value$.set(shape)}
        />
      ))}
    </HoverDropdown>
  );
};

type EyeOptionProps = {
  shape: BaseShapeOptions;
  isSelected: boolean;
  onSelect: () => void;
};

const EyeOption = ({ shape, isSelected, onSelect }: EyeOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const shapePath = useMemo(
    () => getPathFromShape(shape, Sizes.shapePreview),
    [shape]
  );

  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        (isHovered || isSelected) && styles.optionHovered,
      ]}
    >
      <View style={styles.shapePreview}>
        <Svg
          width={Sizes.shapePreview}
          height={Sizes.shapePreview}
          viewBox={`0 0 ${Sizes.shapePreview} ${Sizes.shapePreview}`}
        >
          <Path d={shapePath} fill="white" />
        </Svg>
      </View>
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {shape}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerPreview: {
    width: Sizes.shapePreview,
    height: Sizes.shapePreview,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
  },
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  shapePreview: {
    width: Sizes.shapePreview,
    height: Sizes.shapePreview,
  },
  optionText: {
    color: Colors.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: Colors.textPrimary,
  },
});
