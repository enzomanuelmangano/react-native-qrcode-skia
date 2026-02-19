import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import type { Observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Shapes } from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { getPathFromShape } from '../../utils/shape-path';
import { Colors, Spacing, Sizes } from '../../design-tokens';

type ShapeDropdownProps = {
  value$: Observable<BaseShapeOptions>;
};

export const ShapeDropdown = ({ value$ }: ShapeDropdownProps) => {
  const value = useSelector(value$);
  const shapePath = useMemo(
    () => getPathFromShape(value, Sizes.shapePreview),
    [value]
  );

  return (
    <HoverDropdown
      label="Shape"
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
        <ShapeOption
          key={shape}
          shape={shape}
          isSelected={value === shape}
          onSelect={() => value$.set(shape)}
        />
      ))}
    </HoverDropdown>
  );
};

type ShapeOptionProps = {
  shape: BaseShapeOptions;
  isSelected: boolean;
  onSelect: () => void;
};

const ShapeOption = ({ shape, isSelected, onSelect }: ShapeOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();
  const shapePath = useMemo(
    () => getPathFromShape(shape, Sizes.shapePreview),
    [shape]
  );

  const handlePress = () => {
    onSelect();
    closeDropdown?.();
  };

  return (
    <Pressable
      onPress={handlePress}
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
