import { Linking, Text, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import { Image } from 'expo-image';
import { PressableScale } from '../pressable-scale';
import useDimensions from '../../hooks/useDimensions';

const GitHubBannerImage = require('../../../assets/images/github-logo.png');

export const GitHubBanner = () => {
  const { isLessThan } = useDimensions();

  const onPress = useCallback(() => {
    Linking.openURL(
      'https://github.com/enzomanuelmangano/react-native-qrcode-skia'
    );
  }, []);

  if (isLessThan('xl')) return null;

  return (
    <PressableScale onPress={onPress} style={styles.container}>
      <Image source={GitHubBannerImage} style={styles.logo} />
      <Text style={styles.text}>qrcode.reactiive.io</Text>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 64,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    flexDirection: 'row',
    gap: 12,
  },
  logo: {
    height: 32,
    aspectRatio: 1,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'regular',
    color: 'white',
  },
});
