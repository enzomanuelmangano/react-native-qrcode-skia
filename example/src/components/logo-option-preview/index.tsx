import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableHighlight } from '../touchable-highlight';

export type LogoOptionPreviewProps = {
  onPress: () => void;
  isActive?: boolean;
  logoEmoji: string;
};

export const LogoOptionPreview = ({
  onPress,
  isActive,
  logoEmoji,
}: LogoOptionPreviewProps) => {
  return (
    <TouchableHighlight
      size={64}
      borderWidth={2}
      isActive={isActive}
      onPress={onPress}
    >
      <Text style={styles.logo}>{logoEmoji}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 38,
  },
});
