import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../states';
import { SearchIcon } from './icons';
import {
  Colors,
  Sizes,
  BorderRadius,
} from '../design-tokens';
import { TimingPresets } from '../animations';

interface URLInputModalProps {
  visible: boolean;
  onClose: () => void;
}

export const URLInputModal = ({ visible, onClose }: URLInputModalProps) => {
  const currentUrl = useSelector(qrcodeState$.qrUrl);
  const [originalUrl, setOriginalUrl] = useState(currentUrl);
  const animation = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setOriginalUrl(currentUrl);
      animation.value = withTiming(1, TimingPresets.modalIn);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // @ts-ignore - setSelectionRange available on web
          if (inputRef.current.setSelectionRange) {
            const len = currentUrl.length;
            // @ts-ignore
            inputRef.current.setSelectionRange(len, len);
          }
        }
      }, 50);
    } else {
      animation.value = withTiming(0, TimingPresets.modalOut);
    }
  }, [visible, animation]);

  const handleCancel = () => {
    qrcodeState$.qrUrl.set(originalUrl);
    onClose();
  };

  const handleConfirm = () => {
    onClose();
  };

  useEffect(() => {
    // @ts-ignore - document is available on web
    if (typeof document !== 'undefined') {
      const handleKeyDown = (e: { key: string }) => {
        if (!visible) return;

        if (e.key === 'Escape') {
          handleCancel();
        }
      };
      // @ts-ignore - document is available on web
      document.addEventListener('keydown', handleKeyDown);
      // @ts-ignore - document is available on web
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [visible, originalUrl]);

  const handleChangeText = (text: string) => {
    qrcodeState$.qrUrl.set(text);
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      { scale: 0.98 + animation.value * 0.02 },
    ],
  }));

  if (!visible && animation.value === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleConfirm} />
      <Animated.View style={[styles.commandBar, cardStyle]}>
        <View style={styles.iconContainer}>
          <SearchIcon />
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={currentUrl}
          onChangeText={handleChangeText}
          onSubmitEditing={handleConfirm}
          placeholder="Type a URL..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="done"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backdropBackground,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 140,
    zIndex: 1000,
  },
  commandBar: {
    width: 640,
    maxWidth: '90%',
    height: 54,
    backgroundColor: Colors.modalBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderModal,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
  },
  iconContainer: {
    width: 44,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 54,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingRight: Sizes.icon,
    outlineStyle: 'none',
  } as any,
});
