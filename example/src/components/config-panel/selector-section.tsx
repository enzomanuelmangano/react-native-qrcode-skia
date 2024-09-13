import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Separator } from '../separator';

interface SelectorSectionProps<T> {
  label: string;
  data?: T[] | readonly T[];
  renderItem?: (item: T) => React.ReactNode;
  customContent?: React.ReactNode;
}

const Padding = 25;

export function SelectorSection<T>({
  label,
  data,
  renderItem,
  customContent,
}: SelectorSectionProps<T>) {
  const { width: windowWidth } = useWindowDimensions();

  const listStyle = {
    minWidth: windowWidth - Padding,
    maxWidth: windowWidth - Padding,
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      {customContent ? (
        customContent
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={listStyle}
          contentContainerStyle={styles.selector}
        >
          {data?.map((item, index) => (
            <View key={index}>{renderItem && renderItem(item)}</View>
          ))}
        </ScrollView>
      )}
      <Separator />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 14,
    marginLeft: 2,
    fontFamily: 'Regular',
  },
  selector: {
    gap: 14,
  },
});
