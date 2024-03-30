import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-skia';

export default function App() {
  return (
    <View style={styles.container}>
      <QRCode value="https://patreon.com/reactiive" size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
