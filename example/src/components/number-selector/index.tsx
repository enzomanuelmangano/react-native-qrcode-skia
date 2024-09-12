import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';

type NumberSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
};

export const NumberSelector = React.memo(
  ({ value, onChange, min = 0, max = 100, style }: NumberSelectorProps) => {
    const { width: windowWidth } = useWindowDimensions();
    return (
      <View
        style={{
          ...styles.container,
          maxWidth: windowWidth,
          ...StyleSheet.flatten(style ?? {}),
        }}
      >
        <TouchableOpacity
          style={{ ...styles.button, marginRight: 8 }}
          onPress={() => onChange(Math.max(min, value - 1))}
        >
          <Entypo name="minus" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onChange(Math.min(max, value + 1))}
        >
          <Entypo name="plus" size={18} color="#fff" />
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
