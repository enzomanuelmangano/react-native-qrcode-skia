import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableHighlight } from '../touchable-highlight';

type LogoSelectorProps = {
  onPress: () => void;
  isActive?: boolean;
  logoEmoji: string;
};

export const LogoSelector = ({
  onPress,
  isActive,
  logoEmoji,
}: LogoSelectorProps) => {
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
