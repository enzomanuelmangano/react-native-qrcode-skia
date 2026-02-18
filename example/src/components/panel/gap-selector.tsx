import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapSizes, type GapSize } from '../../states';
import { Themes } from '../../constants';

export const GapSelector = () => {
  const currentValue = useSelector(qrcodeState$.gap);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gap</Text>
      <View style={styles.selector}>
        {GapSizes.map((size) => (
          <GapButton
            key={size}
            size={size}
            isActive={currentValue === size}
            activeColor={theme.colors[0]}
            onPress={() => qrcodeState$.gap.set(size)}
          />
        ))}
      </View>
    </View>
  );
};

type GapButtonProps = {
  size: GapSize;
  isActive: boolean;
  activeColor: string;
  onPress: () => void;
};

const GapButton = ({
  size,
  isActive,
  activeColor,
  onPress,
}: GapButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.button,
        isActive && { backgroundColor: activeColor },
        !isActive && isHovered && styles.buttonHovered,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          isActive && styles.buttonTextActive,
          !isActive && isHovered && styles.buttonTextHovered,
        ]}
      >
        {size}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    gap: 10,
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 3,
  },
  button: {
    paddingHorizontal: 8,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
  },
  buttonTextHovered: {
    color: 'rgba(255,255,255,0.7)',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
});
