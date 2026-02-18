import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GradientTypeOptions } from '../../states';
import { HoverDropdown } from './hover-dropdown';

type GradientType = (typeof GradientTypeOptions)[number];

const TriggerSize = 12;
const DropdownPreviewSize = 12;

const getGradientLabel = (gradient: GradientType): string => {
  switch (gradient) {
    case 'radial':
      return 'radial';
    case 'linear':
      return 'linear';
    case 'linear-vertical':
      return 'vertical';
    case 'sweep':
      return 'sweep';
    case 'conical':
      return 'conical';
    default:
      return gradient;
  }
};

const getGradientDirection = (
  gradient: GradientType
): { start: { x: number; y: number }; end: { x: number; y: number } } => {
  switch (gradient) {
    case 'linear':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
    case 'linear-vertical':
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    case 'radial':
    case 'sweep':
    case 'conical':
    default:
      return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
  }
};

export const GradientSelector = () => {
  const selectedGradient = useSelector(qrcodeState$.selectedGradient);
  const direction = getGradientDirection(selectedGradient);

  return (
    <HoverDropdown
      label={getGradientLabel(selectedGradient)}
      trigger={
        <View style={styles.triggerPreview}>
          <LinearGradient
            colors={['#ffffff', 'rgba(255,255,255,0.2)']}
            start={direction.start}
            end={direction.end}
            style={styles.gradientFill}
          />
        </View>
      }
    >
      {GradientTypeOptions.map((gradient) => (
        <GradientOption
          key={gradient}
          gradient={gradient}
          isSelected={selectedGradient === gradient}
          onSelect={() => qrcodeState$.selectedGradient.set(gradient)}
        />
      ))}
    </HoverDropdown>
  );
};

type GradientOptionProps = {
  gradient: GradientType;
  isSelected: boolean;
  onSelect: () => void;
};

const GradientOption = ({
  gradient,
  isSelected,
  onSelect,
}: GradientOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const direction = getGradientDirection(gradient);

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
      <View style={styles.preview}>
        <LinearGradient
          colors={['#ffffff', 'rgba(255,255,255,0.2)']}
          start={direction.start}
          end={direction.end}
          style={styles.gradientFill}
        />
      </View>
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {getGradientLabel(gradient)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerPreview: {
    width: TriggerSize,
    height: TriggerSize,
    borderRadius: 3,
    overflow: 'hidden',
  },
  gradientFill: {
    flex: 1,
  },
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
  preview: {
    width: DropdownPreviewSize,
    height: DropdownPreviewSize,
    borderRadius: 3,
    overflow: 'hidden',
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: '#fff',
  },
});
