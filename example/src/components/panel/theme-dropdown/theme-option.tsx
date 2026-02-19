import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

interface ThemeOptionProps {
  name: string;
  theme: { colors: readonly [string, string] };
  isSelected: boolean;
  onPress: () => void;
}

export const ThemeOption = ({
  name,
  theme,
  isSelected,
  onPress,
}: ThemeOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      style={[
        styles.option,
        (isHovered || isSelected) && styles.optionHovered,
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <LinearGradient
        colors={[theme.colors[0], theme.colors[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.optionCircle}
      />
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {name}
      </Text>
    </Pressable>
  );
};
