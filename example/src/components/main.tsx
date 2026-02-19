import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { Panel } from './panel';
import { QRCodeDisplay } from './qrcode-display';
import { URLInputModal } from './url-input-modal';
import { Colors } from '../design-tokens';

export default function App() {
  const [isURLModalVisible, setIsURLModalVisible] = useState(false);

  const handleURLButtonPress = useCallback(() => {
    setIsURLModalVisible(true);
  }, []);

  const handleURLModalClose = useCallback(() => {
    setIsURLModalVisible(false);
  }, []);

  useEffect(() => {
    // @ts-ignore - document is available on web
    if (typeof document !== 'undefined') {
      const handleKeyDown = (e: { key: string; metaKey: boolean; ctrlKey: boolean; preventDefault: () => void }) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsURLModalVisible((prev) => !prev);
        }
      };
      // @ts-ignore - document is available on web
      document.addEventListener('keydown', handleKeyDown, true);
      // @ts-ignore - document is available on web
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }
    return undefined;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <View style={styles.content}>
        <React.Suspense
          fallback={
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={Colors.loaderColor} />
            </View>
          }
        >
          <QRCodeDisplay />
        </React.Suspense>
      </View>
      <Panel onURLButtonPress={handleURLButtonPress} />
      <URLInputModal visible={isURLModalVisible} onClose={handleURLModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
