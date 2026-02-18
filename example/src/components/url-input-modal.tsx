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
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../states';

const ANIMATION_DURATION = 120;
const EASING = Easing.out(Easing.cubic);

const SearchIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

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
      // Store original value for cancel
      setOriginalUrl(currentUrl);
      animation.value = withTiming(1, { duration: ANIMATION_DURATION, easing: EASING });
      // Focus and move cursor to end
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
      animation.value = withTiming(0, { duration: ANIMATION_DURATION, easing: EASING });
    }
  }, [visible, animation]);

  const handleCancel = () => {
    // Restore original value
    qrcodeState$.qrUrl.set(originalUrl);
    onClose();
  };

  const handleConfirm = () => {
    // Keep current value (already in state)
    onClose();
  };

  useEffect(() => {
    // @ts-ignore - document is available on web
    if (typeof document !== 'undefined') {
      const handleKeyDown = (e: { key: string }) => {
        if (!visible) return;

        // Escape to cancel
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 140,
    zIndex: 1000,
  },
  commandBar: {
    width: 640,
    maxWidth: '90%',
    height: 54,
    backgroundColor: 'rgba(30,30,30,0.98)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: '#fff',
    paddingRight: 16,
    outlineStyle: 'none',
  } as any,
});
