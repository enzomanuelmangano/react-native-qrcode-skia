import React, { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoEmojis } from '../../states';
import { HoverDropdown } from './hover-dropdown';

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
      label={LogoLabels[selectedLogo] || 'logo'}
      trigger={
        <Text style={styles.triggerEmoji}>{selectedLogo || '\u2205'}</Text>
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
      <Text style={styles.optionEmoji}>{emoji || '\u2205'}</Text>
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
  optionEmoji: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
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
