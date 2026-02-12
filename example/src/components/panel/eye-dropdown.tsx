import React, { useState, useMemo } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import type { Observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Shapes } from '../../states';
import { HoverDropdown } from './hover-dropdown';

const TriggerEyeSize = 12;
const DropdownEyeSize = 12;

type EyeDropdownProps = {
  value$: Observable<BaseShapeOptions>;
};

export const EyeDropdown = ({ value$ }: EyeDropdownProps) => {
  const value = useSelector(value$);

  return (
    <HoverDropdown
      label={value}
      trigger={
        <EyePattern shape={value} size={TriggerEyeSize} />
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
      <EyePattern shape={shape} size={DropdownEyeSize} />
      <Text style={[styles.optionText, (isHovered || isSelected) && styles.optionTextHovered]}>
        {shape}
      </Text>
    </Pressable>
  );
};

const EyePattern = ({ shape, size }: { shape: BaseShapeOptions; size: number }) => {
  const innerSize = size * 0.35;
  const offset = (size - innerSize) / 2;
  const strokeW = size * 0.15;

  const pattern = useMemo(() => {
    switch (shape) {
      case 'square':
        return (
          <>
            <Rect x={strokeW/2} y={strokeW/2} width={size - strokeW} height={size - strokeW} fill="none" stroke="white" strokeWidth={strokeW} />
            <Rect x={offset} y={offset} width={innerSize} height={innerSize} fill="white" />
          </>
        );
      case 'circle':
        return (
          <>
            <Circle cx={size/2} cy={size/2} r={(size - strokeW)/2} fill="none" stroke="white" strokeWidth={strokeW} />
            <Circle cx={size/2} cy={size/2} r={innerSize/2} fill="white" />
          </>
        );
      case 'rounded': {
        const rx = size * 0.25;
        return (
          <>
            <Rect x={strokeW/2} y={strokeW/2} width={size - strokeW} height={size - strokeW} rx={rx} fill="none" stroke="white" strokeWidth={strokeW} />
            <Rect x={offset} y={offset} width={innerSize} height={innerSize} rx={rx * 0.4} fill="white" />
          </>
        );
      }
      case 'diamond': {
        const half = size / 2;
        const innerHalf = innerSize / 2;
        const inset = strokeW * 0.7;
        return (
          <>
            <Path d={`M${half},${inset} L${size - inset},${half} L${half},${size - inset} L${inset},${half} Z`} fill="none" stroke="white" strokeWidth={strokeW} />
            <Path d={`M${half},${offset} L${half + innerHalf},${half} L${half},${half + innerHalf} L${offset},${half} Z`} fill="white" />
          </>
        );
      }
      case 'star':
        return (
          <>
            <Path d={getStarPath(size/2, size/2, (size - strokeW)/2, ((size - strokeW)/2) * 0.4, 5)} fill="none" stroke="white" strokeWidth={strokeW} />
            <Circle cx={size/2} cy={size/2} r={innerSize/2} fill="white" />
          </>
        );
      case 'triangle': {
        const inset = strokeW * 0.7;
        return (
          <>
            <Path d={`M${size/2},${inset} L${size - inset},${size - inset} L${inset},${size - inset} Z`} fill="none" stroke="white" strokeWidth={strokeW} />
            <Circle cx={size/2} cy={size * 0.6} r={innerSize/2.5} fill="white" />
          </>
        );
      }
      default:
        return null;
    }
  }, [shape, size, innerSize, offset, strokeW]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {pattern}
    </Svg>
  );
};

const getStarPath = (cx: number, cy: number, outerR: number, innerR: number, points: number) => {
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }
  return `${path} Z`;
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  optionHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  optionTextHovered: {
    color: '#fff',
  },
});
