import { StyleSheet, Text } from 'react-native';
import { PressableScale } from '../pressable-scale';
import { Ionicons } from '@expo/vector-icons';
import { useCopyQrCode } from './hooks/use-copy-qrcode';

export const QrCodeCopyButton = () => {
  const copyQrCode = useCopyQrCode();
  return (
    <PressableScale onPress={copyQrCode} style={styles.container}>
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
