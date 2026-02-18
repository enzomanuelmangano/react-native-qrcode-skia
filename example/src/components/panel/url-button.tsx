import React, { useState } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../states';

const LinkIcon = ({ color = 'rgba(255,255,255,0.5)' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface URLButtonProps {
  onPress: () => void;
}

const truncateUrl = (url: string, maxLength: number = 20): string => {
  if (url.length <= maxLength) return url;

  // Remove protocol for display
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
      <LinkIcon color={isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'} />
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
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    gap: 8,
  },
  buttonHovered: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextHovered: {
    color: 'rgba(255,255,255,0.95)',
  },
});
