import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

type NumberSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export const NumberSelector = React.memo(
  ({ value, onChange, min = 0, max = 100 }: NumberSelectorProps) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Text style={styles.text}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>

        <View style={styles.fill} />
        <Text style={styles.text}>{value}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fill: {
    flex: 1,
  },
  button: {
    height: 48,
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
