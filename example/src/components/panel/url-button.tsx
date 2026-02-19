import React, { useState } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../states';
import { LinkIcon } from '../icons';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
} from '../../design-tokens';

interface URLButtonProps {
  onPress: () => void;
}

const truncateUrl = (url: string, maxLength: number = 20): string => {
  if (url.length <= maxLength) return url;

  let displayUrl = url.replace(/^https?:\/\//, '');

  if (displayUrl.length <= maxLength) return displayUrl;

  return displayUrl.substring(0, maxLength - 3) + '...';
};

export const URLButton = ({ onPress }: URLButtonProps) => {
  const currentUrl = useSelector(qrcodeState$.qrUrl);
  const [isHovered, setIsHovered] = useState(false);

  const displayUrl = truncateUrl(currentUrl);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[styles.button, isHovered && styles.buttonHovered]}
    >
      <LinkIcon color={isHovered ? Colors.iconHovered : Colors.iconDefault} />
      <Text style={[styles.buttonText, isHovered && styles.buttonTextHovered]}>
        {displayUrl}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  buttonHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  buttonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextHovered: {
    color: Colors.textHovered,
  },
});
