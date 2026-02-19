import React, { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoEmojis } from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { Colors, Spacing } from '../../design-tokens';

const LogoLabels: Record<string, string> = {
  '': 'none',
  '\uD83D\uDC36': 'dog',
  '\uD83D\uDC30': 'bunny',
  '\uD83E\uDD8A': 'fox',
  '\uD83D\uDC3C': 'panda',
  '\uD83D\uDC28': 'koala',
};

export const LogoDropdown = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);

  return (
    <HoverDropdown
      label="Logo"
      trigger={
        <Text style={styles.triggerEmoji}>{selectedLogo || '—'}</Text>
      }
    >
      {LogoEmojis.map((emoji, index) => (
        <LogoOption
          key={index}
          emoji={emoji}
          isSelected={selectedLogo === emoji}
          onSelect={() => qrcodeState$.selectedLogo.set(emoji)}
        />
      ))}
    </HoverDropdown>
  );
};

type LogoOptionProps = {
  emoji: string;
  isSelected: boolean;
  onSelect: () => void;
};

const LogoOption = ({ emoji, isSelected, onSelect }: LogoOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();

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
      <Text style={styles.optionEmoji}>{emoji || '—'}</Text>
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {LogoLabels[emoji] || 'logo'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerEmoji: {
    fontSize: 16,
    color: Colors.textPrimary,
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
  optionEmoji: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
    color: Colors.textPrimary,
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
