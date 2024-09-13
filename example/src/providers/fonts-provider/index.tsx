import { useFonts } from 'expo-font';
import type { PropsWithChildren } from 'react';
import React from 'react';

type FontsProviderProps = PropsWithChildren;

export const FontsProvider: React.FC<FontsProviderProps> = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Regular: require('../../../assets/fonts/regular.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <>{children}</>;
};
