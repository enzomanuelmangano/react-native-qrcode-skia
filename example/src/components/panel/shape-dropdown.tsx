import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import type { Observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Shapes } from '../../states';
import { HoverDropdown } from './hover-dropdown';

const TriggerShapeSize = 14;
const DropdownShapeSize = 14;

const getPathFromShape = (shape: BaseShapeOptions, shapeSize: number = 14) => {
  switch (shape) {
    case 'square':
      return `M0,0 H${shapeSize} V${shapeSize} H0 Z`;
    case 'circle':
      return `M${shapeSize / 2},0 A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},${shapeSize} A${shapeSize / 2},${shapeSize / 2} 0 1,1 ${shapeSize / 2},0 Z`;
    case 'rounded': {
      const r = shapeSize * 0.2;
      return `M${r},0 H${shapeSize - r} A${r},${r} 0 0,1 ${shapeSize},${r} V${shapeSize - r} A${r},${r} 0 0,1 ${shapeSize - r},${shapeSize} H${r} A${r},${r} 0 0,1 0,${shapeSize - r} V${r} A${r},${r} 0 0,1 ${r},0 Z`;
    }
    case 'diamond': {
      const halfSize = shapeSize / 2;
      return `M${halfSize},0 L${shapeSize},${halfSize} L${halfSize},${shapeSize} L0,${halfSize} Z`;
    }
    case 'star': {
      const centerX = shapeSize / 2;
      const centerY = shapeSize / 2;
      const outerRadius = shapeSize / 2;
      const innerRadius = outerRadius * 0.4;
      const numPoints = 5;
      let path = '';
      for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
      }
      return `${path} Z`;
    }
    case 'triangle':
      return `M${shapeSize / 2},0 L${shapeSize},${shapeSize} L0,${shapeSize} Z`;
    default:
      return '';
  }
};

type ShapeDropdownProps = {
  value$: Observable<BaseShapeOptions>;
};

export const ShapeDropdown = ({ value$ }: ShapeDropdownProps) => {
  const value = useSelector(value$);
  const shapePath = useMemo(
    () => getPathFromShape(value, TriggerShapeSize),
    [value]
  );

  return (
    <HoverDropdown
      label={value}
      trigger={
        <View style={styles.triggerPreview}>
          <Svg
            width={TriggerShapeSize}
            height={TriggerShapeSize}
            viewBox={`0 0 ${TriggerShapeSize} ${TriggerShapeSize}`}
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
  const shapePath = useMemo(
    () => getPathFromShape(shape, DropdownShapeSize),
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
          width={DropdownShapeSize}
          height={DropdownShapeSize}
          viewBox={`0 0 ${DropdownShapeSize} ${DropdownShapeSize}`}
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
    width: 14,
    height: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  optionHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  shapePreview: {
    width: 14,
    height: 14,
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
    width: 60,
  },
  optionTextHovered: {
    color: '#fff',
  },
});
