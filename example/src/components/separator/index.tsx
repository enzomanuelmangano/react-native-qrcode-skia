import React from 'react';
import { View } from 'react-native';

type SeparatorProps = {
  height?: number;
};
export const Separator = React.memo(({ height = 32 }: SeparatorProps) => {
  return <View style={{ height }} />;
});
