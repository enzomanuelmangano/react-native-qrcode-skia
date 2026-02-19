import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDropdownClose } from '../hover-dropdown';
import type { GradientType } from '../../../states';
import { getGradientLabel, getGradientDirection } from './utils';
import { styles } from './styles';

type GradientOptionProps = {
  gradient: GradientType;
  isSelected: boolean;
  onSelect: () => void;
};

export const GradientOption = ({
  gradient,
  isSelected,
  onSelect,
}: GradientOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();
  const direction = getGradientDirection(gradient);

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
