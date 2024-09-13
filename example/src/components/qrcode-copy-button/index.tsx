import { StyleSheet, Text } from 'react-native';
import { PressableScale } from '../pressable-scale';
import { Ionicons } from '@expo/vector-icons';

export const QrCodeCopyButton = () => {
  return (
    <PressableScale style={styles.container}>
      <Ionicons name="copy-outline" size={16} color="white" />
      <Text style={styles.label}>Copy</Text>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginTop: 10,
  },
  label: {
    color: 'white',
    fontSize: 20,
  },
});
