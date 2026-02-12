import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GradientTypeOptions } from '../../states';
import { getSkiaGradientByType } from '../../utils/gradient';
import { HoverDropdown } from './hover-dropdown';

type GradientType = (typeof GradientTypeOptions)[number];

const TriggerSize = 12;
const DropdownPreviewSize = 12;

const getGradientLabel = (gradient: GradientType): string => {
  switch (gradient) {
    case 'radial': return 'radial';
    case 'linear': return 'linear';
    case 'linear-vertical': return 'vertical';
    case 'sweep': return 'sweep';
    case 'conical': return 'conical';
    default: return gradient;
  }
};

export const GradientSelector = () => {
  const selectedGradient = useSelector(qrcodeState$.selectedGradient);

  const triggerGradient = useMemo(
    () =>
      getSkiaGradientByType({
        gradient: selectedGradient,
        colors: ['#ffffff', 'transparent'],
        size: TriggerSize,
      }),
    [selectedGradient]
  );

  return (
    <HoverDropdown
      label={getGradientLabel(selectedGradient)}
      trigger={
        <View style={styles.triggerPreview}>
          <Canvas style={styles.triggerCanvas}>
            <Rect x={0} y={0} width={TriggerSize} height={TriggerSize}>
              {triggerGradient}
            </Rect>
          </Canvas>
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

const GradientOption = ({ gradient, isSelected, onSelect }: GradientOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradientComponent = useMemo(
    () =>
      getSkiaGradientByType({
        gradient,
        colors: ['#ffffff', 'transparent'],
        size: DropdownPreviewSize,
      }),
    [gradient]
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
      <View style={styles.preview}>
        <Canvas style={styles.canvas}>
          <Rect x={0} y={0} width={DropdownPreviewSize} height={DropdownPreviewSize}>
            {gradientComponent}
          </Rect>
        </Canvas>
      </View>
      <Text style={[styles.optionText, (isHovered || isSelected) && styles.optionTextHovered]}>
        {getGradientLabel(gradient)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerPreview: {
    width: TriggerSize,
    height: TriggerSize,
    borderRadius: 6,
    overflow: 'hidden',
  },
  triggerCanvas: {
    width: TriggerSize,
    height: TriggerSize,
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
    borderRadius: 6,
    overflow: 'hidden',
  },
  canvas: {
    width: DropdownPreviewSize,
    height: DropdownPreviewSize,
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  optionTextHovered: {
    color: '#fff',
  },
});
